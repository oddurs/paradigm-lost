/**
 * A small token-threaded Forth, written so that the Forth exhibit genuinely
 * executes rather than being replayed from a recording.
 *
 * Colon definitions are compiled to flat instruction arrays with resolved
 * branch targets; the machine then advances exactly one instruction per call
 * to `step`, which is what lets the panel show the data stack filling and
 * draining a word at a time. Amounts are integer cents — this dialect has no
 * floating point, and neither did the ones it is imitating.
 */

import { DECK, DEPTS, money, pad, rpad } from '@/data/deck';
import type { Step } from '@/data/types';

export const FORTH_SOURCE = `VARIABLE SUM   VARIABLE GRAND   VARIABLE LAST

: BREAK    LAST @ .DEPT  SUM @ .MONEY  CR
           SUM @ GRAND +!   0 SUM ! ;

: RECORD   SWAP DUP LAST @ <> IF
                LAST @ -1 <> IF BREAK THEN
                LAST !
           ELSE DROP THEN
           SUM +! ;

: RUN      12 0 DO  I CARD RECORD  LOOP
           BREAK  ." GRAND TOTAL" GRAND @ .MONEY CR ;`;

type Item = { kind: 'num'; v: number } | { kind: 'addr'; name: string };

type Instr =
  | { op: 'lit'; v: number }
  | { op: 'addr'; name: string }
  | { op: 'prim'; name: string }
  | { op: 'call'; name: string }
  | { op: 'zbranch'; t: number }
  | { op: 'branch'; t: number }
  | { op: 'do'; t: number }
  | { op: 'loop'; t: number }
  | { op: 'index' }
  | { op: 'emit'; text: string }
  | { op: 'nop' };

type Token = { w: string } | { print: string };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  const raw = src.replace(/\s+/g, ' ').trim().split(' ');
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '."') {
      const words: string[] = [];
      while (++i < raw.length) {
        const w = raw[i];
        if (w.endsWith('"')) {
          words.push(w.slice(0, -1));
          break;
        }
        words.push(w);
      }
      out.push({ print: words.join(' ') });
    } else {
      out.push({ w: raw[i] });
    }
  }
  return out;
}

const PRIMS = new Set([
  '@', '!', '+!', 'DUP', 'DROP', 'SWAP', '<>', '=', 'CR', '.DEPT', '.MONEY', 'CARD',
]);

/** Compile one word body, resolving IF/ELSE/THEN and DO/LOOP to targets. */
function compile(tokens: Token[], vars: Set<string>): Instr[] {
  const code: Instr[] = [];
  const ifStack: number[] = [];
  const doStack: number[] = [];

  for (const t of tokens) {
    if ('print' in t) {
      code.push({ op: 'emit', text: t.print });
      continue;
    }
    const w = t.w;
    if (w === 'IF') {
      ifStack.push(code.length);
      code.push({ op: 'zbranch', t: -1 });
    } else if (w === 'ELSE') {
      const open = ifStack.pop()!;
      const here = code.length;
      code.push({ op: 'branch', t: -1 });
      (code[open] as { t: number }).t = here + 1;
      ifStack.push(here);
    } else if (w === 'THEN') {
      const open = ifStack.pop()!;
      (code[open] as { t: number }).t = code.length;
      code.push({ op: 'nop' });
    } else if (w === 'DO') {
      doStack.push(code.length);
      code.push({ op: 'do', t: -1 });
    } else if (w === 'LOOP') {
      const open = doStack.pop()!;
      code.push({ op: 'loop', t: open + 1 });
      (code[open] as { t: number }).t = code.length;
    } else if (w === 'I') {
      code.push({ op: 'index' });
    } else if (/^-?\d+$/.test(w)) {
      code.push({ op: 'lit', v: parseInt(w, 10) });
    } else if (vars.has(w)) {
      code.push({ op: 'addr', name: w });
    } else if (PRIMS.has(w)) {
      code.push({ op: 'prim', name: w });
    } else {
      code.push({ op: 'call', name: w });
    }
  }
  return code;
}

const LABEL: Record<string, string> = {
  '@': 'fetch the variable',
  '!': 'store into the variable',
  '+!': 'add into the variable',
  DUP: 'copy the top of stack',
  DROP: 'discard the top',
  SWAP: 'exchange the top two',
  '<>': 'compare — not equal?',
  CR: 'strike the line',
  '.DEPT': 'print the department name',
  '.MONEY': 'print as dollars and cents',
  CARD: 'read a card — leaves dept and amount',
};

export function runForth(): Step[] {
  /* ---- compile ---- */
  const tokens = tokenize(FORTH_SOURCE);
  const vars = new Set<string>();
  const dict: Record<string, Instr[]> = {};

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if ('w' in t && t.w === 'VARIABLE') {
      const next = tokens[++i];
      if ('w' in next) vars.add(next.w);
    }
  }
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if ('w' in t && t.w === ':') {
      const head = tokens[++i];
      const name = 'w' in head ? head.w : '';
      const body: Token[] = [];
      while (++i < tokens.length) {
        const b = tokens[i];
        if ('w' in b && b.w === ';') break;
        body.push(b);
      }
      dict[name] = compile(body, vars);
    }
  }

  /* ---- run ---- */
  const mem: Record<string, number> = { SUM: 0, GRAND: 0, LAST: -1 };
  const S: Item[] = [];
  const frames: { code: Instr[]; ip: number; name: string }[] = [
    { code: dict.RUN, ip: 0, name: 'RUN' },
  ];
  const loops: { i: number; limit: number }[] = [];
  const steps: Step[] = [];
  let pending = '';
  let guard = 0;

  const num = (): number => {
    const it = S.pop()!;
    return it.kind === 'num' ? it.v : 0;
  };
  const addr = (): string => {
    const it = S.pop()!;
    return it.kind === 'addr' ? it.name : 'SUM';
  };
  const show = (it: Item): string =>
    it.kind === 'addr'
      ? it.name
      : Math.abs(it.v) >= 1000
        ? money(it.v)
        : String(it.v);

  const record = (say: string, print?: string | null) => {
    steps.push({
      say,
      print: print ?? null,
      st: {
        kind: 'stack',
        stack: S.map(show),
        vars: [
          ['SUM', money(mem.SUM)],
          ['GRAND', money(mem.GRAND)],
          ['LAST', mem.LAST < 0 ? '—' : DEPTS[mem.LAST]],
        ],
      },
    });
  };

  while (frames.length && guard++ < 20000) {
    const f = frames[frames.length - 1];
    if (f.ip >= f.code.length) {
      frames.pop();
      continue;
    }
    const ins = f.code[f.ip++];
    let say = '';
    let printed: string | null = null;

    switch (ins.op) {
      case 'lit':
        S.push({ kind: 'num', v: ins.v });
        say = `<b>${ins.v}</b> — push a literal.`;
        break;
      case 'addr':
        S.push({ kind: 'addr', name: ins.name });
        say = `<b>${ins.name}</b> — push the variable's address, not its value.`;
        break;
      case 'index':
        S.push({ kind: 'num', v: loops[loops.length - 1]?.i ?? 0 });
        say = `<b>I</b> — push the loop index.`;
        break;
      case 'nop':
        continue;
      case 'zbranch': {
        const flag = num();
        if (!flag) f.ip = ins.t;
        say = `<b>IF</b> — ${flag ? 'true, fall through.' : 'false, jump past the branch.'}`;
        break;
      }
      case 'branch':
        f.ip = ins.t;
        say = `<b>ELSE</b> — skip to THEN.`;
        break;
      case 'do': {
        const start = num();
        const limit = num();
        if (start >= limit) f.ip = ins.t;
        else loops.push({ i: start, limit });
        say = `<b>DO</b> — begin the card loop, ${start} to ${limit}.`;
        break;
      }
      case 'loop': {
        const top = loops[loops.length - 1];
        top.i += 1;
        if (top.i < top.limit) f.ip = ins.t;
        else loops.pop();
        say = `<b>LOOP</b> — ${top.i < top.limit ? `next card, index ${top.i}.` : 'hopper empty.'}`;
        break;
      }
      case 'call':
        frames.push({ code: dict[ins.name], ip: 0, name: ins.name });
        say = `<b>${ins.name}</b> — call the definition.`;
        break;
      case 'emit':
        pending += pad(ins.text, 14);
        say = `<b>." ${ins.text}"</b> — put a literal in the print buffer.`;
        break;
      case 'prim': {
        const n = ins.name;
        say = `<b>${n}</b> — ${LABEL[n] ?? ''}`;
        if (n === '@') S.push({ kind: 'num', v: mem[addr()] });
        else if (n === '!') {
          const a = addr();
          mem[a] = num();
        } else if (n === '+!') {
          const a = addr();
          mem[a] += num();
        } else if (n === 'DUP') S.push({ ...S[S.length - 1] });
        else if (n === 'DROP') S.pop();
        else if (n === 'SWAP') {
          const b = S.pop()!;
          const a = S.pop()!;
          S.push(b, a);
        } else if (n === '<>') {
          const b = num();
          const a = num();
          S.push({ kind: 'num', v: a !== b ? -1 : 0 });
        } else if (n === '=') {
          const b = num();
          const a = num();
          S.push({ kind: 'num', v: a === b ? -1 : 0 });
        } else if (n === '.DEPT') pending += pad(DEPTS[num()] ?? '', 14);
        else if (n === '.MONEY') pending += rpad(money(num()), 9);
        else if (n === 'CR') {
          printed = pending;
          pending = '';
        } else if (n === 'CARD') {
          const c = DECK[num()];
          S.push({ kind: 'num', v: c.dept }, { kind: 'num', v: c.cents });
          say = `<b>CARD</b> — read ${c.name}, ${DEPTS[c.dept]}, ${money(c.cents)}. Two values land on the stack; there are no parameters in this language.`;
        }
        break;
      }
    }
    record(say, printed);
  }

  /* the grand-total line is the last one struck; mark it for the printer */
  for (let i = steps.length - 1; i >= 0; i--) {
    const p = steps[i].print;
    if (typeof p === 'string' && p.trim().startsWith('GRAND')) {
      steps[i] = { ...steps[i], print: { grand: p } };
      break;
    }
  }
  return steps;
}

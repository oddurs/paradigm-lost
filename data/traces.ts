import { DECK, DEPTS, GRAND, TOTALS, line, money } from '@/data/deck';
import type { Step } from '@/data/types';

const grand = (cents: number) => ({ grand: line('GRAND TOTAL', cents) });

/* ------------------------------------------------------------------ *
 * The control break, written out longhand.
 * FORTRAN, COBOL and Forth all walk this exact shape; only the names
 * of the three accumulators change.
 * ------------------------------------------------------------------ */
export function breakTrace(names: { prev: string; sum: string; grand: string }): Step[] {
  const steps: Step[] = [];
  let sum = 0;
  let total = 0;
  let last: string | null = null;

  steps.push({
    say: 'Deck mounted, accumulators cleared. Nothing here works unless the cards arrived sorted.',
    st: {
      kind: 'slots',
      slots: [[names.prev, '—'], [names.sum, '0.00'], [names.grand, '0.00']],
      hot: [],
      card: null,
    },
  });

  DECK.forEach((card, i) => {
    const dept = DEPTS[card.dept];
    if (last !== null && dept !== last) {
      total += sum;
      steps.push({
        say: '<b>Control break.</b> The department field changed — print the subtotal, fold it into the grand, clear the counter.',
        print: line(last, sum),
        st: {
          kind: 'slots',
          slots: [[names.prev, last], [names.sum, money(sum)], [names.grand, money(total)]],
          hot: [0, 1, 2],
          card: i,
        },
      });
      sum = 0;
    }
    last = dept;
    sum += card.cents;
    steps.push({
      say: `Read card ${i + 1}: <b>${card.name}</b>, ${dept}, ${money(card.cents)} — add it to the department counter.`,
      st: {
        kind: 'slots',
        slots: [[names.prev, dept], [names.sum, money(sum)], [names.grand, money(total)]],
        hot: [1],
        card: i,
      },
    });
  });

  total += sum;
  steps.push({
    say: '<b>Last card.</b> The final break has no successor to trigger it. You have to remember to do this one yourself, after the loop — and the programs that forgot silently dropped a department.',
    print: line(last!, sum),
    st: {
      kind: 'slots',
      slots: [[names.prev, last!], [names.sum, money(sum)], [names.grand, money(total)]],
      hot: [0, 1, 2],
      card: null,
    },
  });
  steps.push({
    say: 'Print the grand total. Twelve cards, one pass, deck order load-bearing throughout.',
    print: grand(total),
    st: {
      kind: 'slots',
      slots: [[names.prev, '—'], [names.sum, '0.00'], [names.grand, money(total)]],
      hot: [2],
      card: null,
    },
  });
  return steps;
}

/* ------------------------------------------------------------------ *
 * Group, then emit. SQL, awk, Smalltalk and pandas all do this, and
 * none of them care what order the cards arrived in.
 * ------------------------------------------------------------------ */
export function groupTrace(copy: { open: string; mid: string; close: string }): Step[] {
  const steps: Step[] = [];
  const acc: Record<string, number> = {};

  steps.push({ say: copy.open, st: { kind: 'table', rows: [], hot: -1, card: null } });

  DECK.forEach((card, i) => {
    const dept = DEPTS[card.dept];
    const fresh = !(dept in acc);
    acc[dept] = (acc[dept] ?? 0) + card.cents;
    const keys = Object.keys(acc);
    steps.push({
      say:
        `Card ${i + 1}: <b>${card.name}</b> → ` +
        (fresh
          ? `no bucket for <b>${dept}</b> yet, so make one.`
          : `add ${money(card.cents)} to the <b>${dept}</b> bucket.`),
      st: {
        kind: 'table',
        rows: keys.map((k) => [k, money(acc[k])] as [string, string]),
        hot: keys.indexOf(dept),
        card: i,
      },
    });
  });

  const settled = DEPTS.map((d, i) => [d, money(TOTALS[i])] as [string, string]);
  steps.push({ say: copy.mid, st: { kind: 'table', rows: settled, hot: -1, card: null } });

  DEPTS.forEach((d, i) => {
    steps.push({
      say: `Emit ${d}.`,
      print: line(d, TOTALS[i]),
      st: { kind: 'table', rows: settled, hot: i, card: null },
    });
  });

  steps.push({
    say: copy.close,
    print: grand(GRAND),
    st: { kind: 'table', rows: settled, hot: -1, card: null },
  });
  return steps;
}

/* ------------------------------------------------------------------ *
 * The 407 control panel. Nothing is sequential here: every cord is
 * simultaneously true, and the cards are what move.
 * ------------------------------------------------------------------ */
export function boardTrace(): Step[] {
  const steps: Step[] = [];
  let sum = 0;
  let total = 0;
  let last: string | null = null;

  steps.push({
    say: 'Panel wired, deck in the hopper, counters at zero. None of these cords has an order — they are all in force at once.',
    st: { kind: 'board', live: [], card: null },
  });

  DECK.forEach((card, i) => {
    const dept = DEPTS[card.dept];
    if (last !== null && dept !== last) {
      total += sum;
      steps.push({
        say: `<b>Comparing exit fires.</b> ${dept} ≠ ${last}, so the unequal impulse starts a minor program step: total exit prints and resets counter 4A.`,
        print: line(last, sum),
        st: { kind: 'board', live: [4, 5, 6], card: i },
      });
      sum = 0;
    }
    last = dept;
    sum += card.cents;
    steps.push({
      say: `Card ${i + 1} through the read station. Name and department to the print entries, amount to counter 4A. Three cords, one card cycle.`,
      st: { kind: 'board', live: [0, 1, 2, 3], card: i },
    });
  });

  total += sum;
  steps.push({
    say: '<b>Last card.</b> End of file takes the final total through the same cords — the machine knows the hopper is empty, so nobody has to remember.',
    print: line(last!, sum),
    st: { kind: 'board', live: [5, 6], card: null },
  });
  steps.push({
    say: 'Grand total off counter 8B, wired identically at the major level. The panel never changed. The cards moved.',
    print: grand(total),
    st: { kind: 'board', live: [], card: null },
  });
  return steps;
}

/* ------------------------------------------------------------------ *
 * The RPG program cycle. Five phases, exactly one of which you wrote.
 * ------------------------------------------------------------------ */
export function cycleTrace(): Step[] {
  const steps: Step[] = [];
  let sum = 0;
  let total = 0;
  let last: string | null = null;
  const slots = (l1: string): [string, string][] => [
    ['DTOT', money(sum)],
    ['GTOT', money(total)],
    ['L1', l1],
  ];

  steps.push({
    say: 'The cycle starts. Nothing of yours is executing — the runtime owns the sequence and will hand you one phase of it.',
    st: { kind: 'cycle', phase: 0, slots: slots('off'), card: null },
  });

  DECK.forEach((card, i) => {
    const dept = DEPTS[card.dept];
    const brk = last !== null && dept !== last;
    steps.push({
      say: `<b>Phase 1 · read</b> — the cycle takes card ${i + 1}. There is no READ statement anywhere in your source.`,
      st: { kind: 'cycle', phase: 0, slots: slots(last === null ? 'off' : 'armed'), card: i },
    });
    steps.push({
      say: brk
        ? '<b>Phase 2 · indicators</b> — DEPT is declared L1, so the cycle compares it against the saved value and <b>L1 comes on</b>.'
        : '<b>Phase 2 · indicators</b> — the cycle compares DEPT with the value it saved last time. Unchanged, so L1 stays off.',
      st: { kind: 'cycle', phase: 1, slots: slots(brk ? 'ON' : 'off'), card: i },
    });
    if (brk) {
      const struck = sum;
      total += sum;
      sum = 0;
      steps.push({
        say: '<b>Phase 3 · total output</b> — the L1 output spec fires, the subtotal prints, and the cycle clears DTOT without being asked.',
        print: line(last!, struck),
        st: { kind: 'cycle', phase: 2, slots: slots('fired'), card: i },
      });
    }
    last = dept;
    sum += card.cents;
    steps.push({
      say: '<b>Phase 4 · calculations</b> — your one C-spec line: ADD AMT to DTOT. This is the entire program you wrote.',
      st: { kind: 'cycle', phase: 3, slots: slots('off'), card: i },
    });
  });

  total += sum;
  steps.push({
    say: '<b>LR</b> — hopper empty. The last-record indicator comes on automatically and the final break fires without anyone remembering to ask for it. RPG cannot have FORTRAN’s dropped-last-group bug.',
    print: line(last!, sum),
    st: { kind: 'cycle', phase: 2, slots: [['DTOT', '0.00'], ['GTOT', money(total)], ['LR', 'ON']], card: null },
  });
  steps.push({
    say: 'The LR output spec prints the grand total and the cycle stops. Six lines of specification did the work of forty lines of COBOL.',
    print: grand(total),
    st: { kind: 'cycle', phase: 2, slots: [['DTOT', '0.00'], ['GTOT', money(total)], ['LR', 'ON']], card: null },
  });
  return steps;
}

/* ------------------------------------------------------------------ *
 * APL: the grouping is a boolean matrix, and the totalling is a
 * matrix product. Control structure dissolved into data structure.
 * ------------------------------------------------------------------ */
export function matrixTrace(): Step[] {
  const steps: Step[] = [];
  steps.push({
    say: '<b>U ← ∪ DEPT</b> — the four distinct departments. This is the only place order appears in the whole program, and only to decide which row is which.',
    st: { kind: 'matrix', built: -1, row: -1, note: 'U — four rows, nothing compared yet' },
  });
  DECK.forEach((card, i) => {
    steps.push({
      say: `<b>∘.≡</b> column ${i + 1} — card ${i + 1} (${card.name}) compared against all four departments at once. Exactly one 1.`,
      st: { kind: 'matrix', built: i, row: card.dept, note: 'U ∘.≡ DEPT — building the 4×12 boolean matrix' },
    });
  });
  steps.push({
    say: 'Matrix complete. Not one amount has been added to anything — <i>the grouping exists before any arithmetic does.</i>',
    st: { kind: 'matrix', built: 11, row: -1, note: 'U ∘.≡ DEPT — complete' },
  });
  DEPTS.forEach((d, i) => {
    steps.push({
      say: `<b>+.×</b> row ${i + 1} — multiply the ${d} mask by the amount vector and sum. One dot product, one subtotal.`,
      print: line(d, TOTALS[i]),
      st: { kind: 'matrix', built: 11, row: i, note: `row ${i + 1} · AMT  →  ${money(TOTALS[i])}` },
    });
  });
  steps.push({
    say: '<b>+/T</b> — sum the result vector. No loop was written, no counter was cleared, and the deck could have arrived in any order at all.',
    print: grand(GRAND),
    st: { kind: 'matrix', built: 11, row: -1, note: `+/T  →  ${money(GRAND)}` },
  });
  return steps;
}

/* ------------------------------------------------------------------ *
 * Prolog: a goal list, unification, and backtracking for the loop.
 * ------------------------------------------------------------------ */
export function goalsTrace(): Step[] {
  const L = (t: string, cls?: 'now' | 'done') => ({ t, cls });
  const steps: Step[] = [];

  steps.push({
    say: 'Query posed. Nothing has been computed — there is only a goal.',
    st: { kind: 'goals', lines: [L('?- total(D, T).', 'now')] },
  });
  steps.push({
    say: 'Unify against the head of the <b>total/2</b> clause. D and T stay unbound; the clause body becomes the new goal list.',
    st: {
      kind: 'goals',
      lines: [
        L('?- total(D, T).', 'done'),
        L('setof(D, N^A^pay(N,D,A), Depts)', 'now'),
        L('member(D, Depts)'),
        L('findall(A, pay(_,D,A), Amounts)'),
        L('sum_list(Amounts, T)'),
      ],
    },
  });
  steps.push({
    say: '<b>setof</b> backtracks through all twelve facts and collects the distinct departments, sorted. This is the only sort in the program, and nobody asked for it.',
    st: {
      kind: 'goals',
      lines: [
        L('setof(...)', 'done'),
        L('<em>Depts = [assembly, payroll, shipping, toolroom]</em>'),
        L('member(D, Depts)', 'now'),
      ],
    },
  });

  DEPTS.forEach((d, i) => {
    const lower = d.toLowerCase();
    const amts = DECK.filter((c) => c.dept === i).map((c) => c.cents);
    steps.push({
      say: '<b>member</b> binds D, and the engine walks on. <b>findall</b> re-queries the facts for this department — there is no accumulator anywhere.',
      st: {
        kind: 'goals',
        lines: [
          L(`<em>D = ${lower}</em>`),
          L(`findall(A, pay(_, ${lower}, A), Amounts)`, 'now'),
          L(`<em>Amounts = [${amts.join(', ')}]</em>`),
          L('sum_list(Amounts, T)'),
        ],
      },
    });
    steps.push({
      say: '<b>sum_list</b> succeeds. One solution to the query — reported, and then the engine deliberately fails back to look for another.',
      print: line(d, TOTALS[i]),
      st: {
        kind: 'goals',
        lines: [
          L(`<em>D = ${lower}</em>`),
          L(`<em>T = ${TOTALS[i]}</em>`),
          L(`✓ solution ${i + 1}`, 'now'),
          L('← backtrack into member/2'),
        ],
      },
    });
  });

  steps.push({
    say: '<b>member</b> is exhausted, the query completes, and no loop was ever written. The same clauses will answer questions you have not thought of yet.',
    print: grand(GRAND),
    st: {
      kind: 'goals',
      lines: [L('?- total(D, T).', 'done'), L('4 solutions.'), L('— fail —', 'done')],
    },
  });
  return steps;
}

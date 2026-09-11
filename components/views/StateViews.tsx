import * as stylex from '@stylexjs/stylex';
import { color } from '@/design/tokens.stylex';
import { border, radius, space } from '@/design/space.stylex';
import { font, leading, size, tracking } from '@/design/type.stylex';
import { DECK, DEPTS, money, pad } from '@/data/deck';
import type { ViewState } from '@/data/types';
import { Plugboard } from './Plugboard';

/* Everything here is drawn on the tube, in phosphor, except the plugboard —
   which is a physical panel and gets to stay one. */

const GLOW = '0 0 6px rgba(138,240,142,0.45)';

const s = stylex.create({
  mono: {
    fontFamily: font.mono,
    color: color.phosphorDim,
    fontVariantNumeric: 'tabular-nums',
  },
  lit: { color: color.phosphor, textShadow: GLOW },

  cols: { display: 'flex', gap: space.xl, flexWrap: 'wrap', alignItems: 'flex-start' },
  label: {
    display: 'block',
    fontFamily: font.plate,
    fontSize: size.micro,
    letterSpacing: tracking.plate,
    textTransform: 'uppercase',
    color: color.phosphorDim,
    opacity: 0.85,
    marginBottom: space.sm,
  },

  /* --- slots: named accumulators --- */
  slots: { display: 'flex', gap: space.sm, flexWrap: 'wrap' },
  slotsCol: { display: 'flex', gap: space.sm, flexDirection: 'column' },
  slot: {
    minWidth: '132px',
    paddingBlock: space.sm,
    paddingInline: space.md,
    borderRadius: radius.tool,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: 'rgba(138,240,142,0.22)',
    backgroundColor: 'rgba(138,240,142,0.05)',
  },
  slotHot: {
    borderColor: color.phosphor,
    backgroundColor: 'rgba(138,240,142,0.13)',
    boxShadow: '0 0 14px rgba(138,240,142,0.22)',
  },
  slotName: {
    display: 'block',
    fontFamily: font.plate,
    fontSize: size.micro,
    letterSpacing: tracking.plateTight,
    textTransform: 'uppercase',
    opacity: 0.72,
  },
  slotValue: { display: 'block', fontSize: size.md, marginTop: '2px' },

  /* --- table: buckets --- */
  table: { borderCollapse: 'collapse', fontSize: size.sm, minWidth: '240px' },
  th: {
    fontFamily: font.plate,
    fontSize: size.micro,
    letterSpacing: tracking.plate,
    textTransform: 'uppercase',
    textAlign: 'left',
    paddingBottom: space.xs,
    paddingRight: space.lg,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(138,240,142,0.3)',
    opacity: 0.8,
    fontWeight: 500,
  },
  thNum: { textAlign: 'right', paddingRight: 0 },
  td: {
    paddingBlock: '3px',
    paddingRight: space.lg,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgba(138,240,142,0.1)',
  },
  tdNum: { textAlign: 'right', paddingRight: 0 },
  empty: { opacity: 0.45, fontStyle: 'italic' },

  /* --- stack --- */
  stack: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '3px',
    minHeight: '150px',
  },
  cell: {
    width: '156px',
    paddingBlock: '4px',
    paddingInline: space.md,
    textAlign: 'right',
    fontSize: size.sm,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: 'rgba(138,240,142,0.2)',
    backgroundColor: 'rgba(138,240,142,0.04)',
  },
  cellTop: {
    borderColor: color.phosphor,
    color: color.phosphor,
    textShadow: GLOW,
    backgroundColor: 'rgba(138,240,142,0.12)',
  },
  cellEmpty: { borderStyle: 'dashed', opacity: 0.4, textAlign: 'center' },

  /* --- matrix --- */
  matrixScroll: { overflowX: 'auto', maxWidth: '100%' },
  matrix: { borderCollapse: 'collapse', fontSize: '10.5px' },
  cellM: {
    width: '20px',
    height: '20px',
    textAlign: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(138,240,142,0.16)',
    opacity: 0.55,
  },
  cellOne: {
    backgroundColor: color.phosphor,
    color: color.crt,
    borderColor: color.phosphor,
    fontWeight: 600,
    opacity: 1,
  },
  rowLabel: {
    borderStyle: 'none',
    textAlign: 'right',
    paddingRight: space.sm,
    fontFamily: font.plate,
    fontSize: size.micro,
    letterSpacing: tracking.plateTight,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  colLabel: { borderStyle: 'none', fontSize: '9px', paddingBottom: '3px', opacity: 0.6 },
  note: {
    marginTop: space.md,
    fontSize: size.xs,
    letterSpacing: tracking.caps,
    opacity: 0.8,
  },

  /* --- goals --- */
  goals: { display: 'flex', flexDirection: 'column', gap: '2px', fontSize: size.sm, lineHeight: leading.snug },
  goal: { opacity: 0.7 },
  goalNow: { color: color.phosphor, textShadow: GLOW, opacity: 1 },
  goalDone: { opacity: 0.38, textDecorationLine: 'line-through' },
  indent: { paddingLeft: space.base },

  /* --- cycle --- */
  cycle: { display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '300px' },
  phase: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: space.base,
    paddingBlock: '5px',
    paddingInline: space.md,
    fontSize: size.xs,
    letterSpacing: tracking.caps,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: 'rgba(138,240,142,0.18)',
    opacity: 0.65,
  },
  phaseOn: {
    borderColor: color.phosphor,
    color: color.phosphor,
    textShadow: GLOW,
    backgroundColor: 'rgba(138,240,142,0.1)',
    opacity: 1,
  },
  who: { opacity: 0.62, fontStyle: 'italic' },

  /* --- shared footer --- */
  station: {
    marginTop: space.base,
    fontSize: size.xs,
    letterSpacing: tracking.caps,
    textTransform: 'uppercase',
    opacity: 0.75,
  },
});

function Station({ card }: { card: number | null | undefined }) {
  if (card == null) return null;
  const c = DECK[card];
  return (
    <div {...stylex.props(s.mono, s.station, s.lit)}>
      In the read station — card {card + 1}/12 · {pad(c.name, 11)}
      {DEPTS[c.dept]} · {money(c.cents)}
    </div>
  );
}

const PHASES: [string, boolean][] = [
  ['1 · Read a card', true],
  ['2 · Set indicators, detect L1', true],
  ['3 · Total-time output', true],
  ['4 · Calculation specs', false],
  ['5 · Detail output', true],
];

export function StateView({ st }: { st: ViewState }) {
  switch (st.kind) {
    case 'board':
      return (
        <Plugboard
          live={st.live}
          cardLabel={
            st.card == null
              ? undefined
              : `READ STATION — CARD ${st.card + 1}/12 · ${DECK[st.card].name} · ${DEPTS[DECK[st.card].dept]}`
          }
        />
      );

    case 'slots':
      return (
        <div {...stylex.props(s.mono)}>
          <div {...stylex.props(s.slots)}>
            {st.slots.map(([name, value], i) => (
              <div key={name} {...stylex.props(s.slot, st.hot.includes(i) && s.slotHot)}>
                <span {...stylex.props(s.slotName)}>{name}</span>
                <span {...stylex.props(s.slotValue, st.hot.includes(i) && s.lit)}>{value}</span>
              </div>
            ))}
          </div>
          <Station card={st.card} />
        </div>
      );

    case 'table':
      return (
        <div {...stylex.props(s.mono)}>
          <table {...stylex.props(s.table)}>
            <thead>
              <tr>
                <th {...stylex.props(s.th)}>Bucket</th>
                <th {...stylex.props(s.th, s.thNum)}>Accumulated</th>
              </tr>
            </thead>
            <tbody>
              {st.rows.length === 0 ? (
                <tr>
                  <td colSpan={2} {...stylex.props(s.td, s.empty)}>
                    empty — nothing read yet
                  </td>
                </tr>
              ) : (
                st.rows.map(([k, v], i) => (
                  <tr key={k}>
                    <td {...stylex.props(s.td, i === st.hot && s.lit)}>{k}</td>
                    <td {...stylex.props(s.td, s.tdNum, i === st.hot && s.lit)}>{v}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Station card={st.card} />
        </div>
      );

    case 'stack':
      return (
        <div {...stylex.props(s.mono, s.cols)}>
          <div>
            <span {...stylex.props(s.label)}>Data stack · top of stack first</span>
            <div {...stylex.props(s.stack)}>
              {st.stack.length === 0 ? (
                <div {...stylex.props(s.cell, s.cellEmpty)}>empty</div>
              ) : (
                [...st.stack].reverse().map((v, i) => (
                  <div key={i} {...stylex.props(s.cell, i === 0 && s.cellTop)}>
                    {v}
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <span {...stylex.props(s.label)}>Variables</span>
            <div {...stylex.props(s.slotsCol)}>
              {st.vars.map(([name, value]) => (
                <div key={name} {...stylex.props(s.slot)}>
                  <span {...stylex.props(s.slotName)}>{name}</span>
                  <span {...stylex.props(s.slotValue)}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'matrix':
      return (
        <div {...stylex.props(s.mono)}>
          <div {...stylex.props(s.matrixScroll)}>
            <table {...stylex.props(s.matrix)}>
              <tbody>
                <tr>
                  <td {...stylex.props(s.cellM, s.colLabel)} />
                  {DECK.map((c) => (
                    <td key={c.name} {...stylex.props(s.cellM, s.colLabel)}>
                      {c.name[0]}
                    </td>
                  ))}
                </tr>
                {DEPTS.map((d, r) => (
                  <tr key={d}>
                    <td {...stylex.props(s.cellM, s.rowLabel, r === st.row && s.lit)}>{d}</td>
                    {DECK.map((c, ci) => {
                      const shown = st.built >= ci;
                      const one = c.dept === r;
                      return (
                        <td
                          key={c.name}
                          {...stylex.props(s.cellM, shown && one && s.cellOne)}
                        >
                          {shown ? (one ? '1' : '0') : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div {...stylex.props(s.note)}>{st.note}</div>
        </div>
      );

    case 'goals':
      return (
        <div {...stylex.props(s.mono, s.goals)}>
          {st.lines.map((l, i) => (
            <div
              key={i}
              {...stylex.props(
                s.goal,
                i > 0 && s.indent,
                l.cls === 'now' && s.goalNow,
                l.cls === 'done' && s.goalDone,
              )}
              dangerouslySetInnerHTML={{ __html: l.t }}
            />
          ))}
        </div>
      );

    case 'cycle':
      return (
        <div {...stylex.props(s.mono, s.cols)}>
          <div {...stylex.props(s.cycle)}>
            <span {...stylex.props(s.label)}>The program cycle</span>
            {PHASES.map(([name, auto], i) => (
              <div key={name} {...stylex.props(s.phase, i === st.phase && s.phaseOn)}>
                <span>{name}</span>
                <span {...stylex.props(s.who)}>{auto ? 'the runtime' : 'you wrote this'}</span>
              </div>
            ))}
          </div>
          <div>
            <span {...stylex.props(s.label)}>Fields and indicators</span>
            <div {...stylex.props(s.slotsCol)}>
              {st.slots.map(([name, value]) => (
                <div key={name} {...stylex.props(s.slot)}>
                  <span {...stylex.props(s.slotName)}>{name}</span>
                  <span {...stylex.props(s.slotValue)}>{value}</span>
                </div>
              ))}
            </div>
            <Station card={st.card} />
          </div>
        </div>
      );
  }
}

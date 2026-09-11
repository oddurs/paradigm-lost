import * as stylex from '@stylexjs/stylex';
import { color } from '@/design/tokens.stylex';
import { font } from '@/design/type.stylex';

/**
 * A removable 407 control panel. Hubs are sockets drilled through a phenolic
 * board; cords are what makes it a program. Real patch cords came in fixed
 * lengths and were colour-coded by length, which is why no two here match.
 */

type Hub = { x: number; y: number; label: string; anchor: 'end' | 'start' };

const HUBS: Record<string, Hub> = {
  rdName: { x: 178, y: 44, label: 'READ EXIT 1-10 · NAME', anchor: 'end' },
  rdDept: { x: 178, y: 72, label: 'READ EXIT 11-18 · DEPT', anchor: 'end' },
  rdAmt: { x: 178, y: 100, label: 'READ EXIT 19-24 · AMT', anchor: 'end' },
  cmpX: { x: 178, y: 132, label: 'COMPARING EXIT · UNEQUAL', anchor: 'end' },
  ctrTot: { x: 178, y: 158, label: 'COUNTER 4A · TOTAL EXIT', anchor: 'end' },

  prName: { x: 432, y: 40, label: 'PRINT ENTRY 1-10', anchor: 'start' },
  prDept: { x: 432, y: 62, label: 'PRINT ENTRY 20-27', anchor: 'start' },
  cmpB: { x: 306, y: 84, label: 'COMPARING ENTRY B', anchor: 'start' },
  ctrAdd: { x: 432, y: 106, label: 'COUNTER 4A · ADD', anchor: 'start' },
  progStart: { x: 306, y: 132, label: 'PROGRAM START (MINOR)', anchor: 'start' },
  prTot: { x: 432, y: 150, label: 'PRINT ENTRY 30-38', anchor: 'start' },
  ctrRst: { x: 432, y: 172, label: 'COUNTER 4A · RESET', anchor: 'start' },
};

/* index order matters: the trace refers to cords by number */
const CORDS: [keyof typeof HUBS, keyof typeof HUBS, string][] = [
  ['rdName', 'prName', '#C6402F'],
  ['rdDept', 'prDept', '#D9A12B'],
  ['rdDept', 'cmpB', '#2F6FA8'],
  ['rdAmt', 'ctrAdd', '#2E7D4F'],
  ['cmpX', 'progStart', '#B5402F'],
  ['ctrTot', 'prTot', '#7A4FA0'],
  ['ctrTot', 'ctrRst', '#1E1B18'],
];

const s = stylex.create({
  svg: { width: '100%', height: 'auto', display: 'block' },
  label: {
    fontFamily: font.mono,
    fontSize: '6.6px',
    letterSpacing: '0.04em',
  },
});

function cordPath(a: Hub, b: Hub): string {
  const dx = Math.abs(b.x - a.x);
  const sag = Math.min(46, 14 + dx * 0.17);
  const mx = (a.x + b.x) / 2;
  const my = Math.max(a.y, b.y) + sag;
  return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
}

export function Plugboard({ live, cardLabel }: { live: number[]; cardLabel?: string }) {
  return (
    <svg
      viewBox="0 0 560 200"
      {...stylex.props(s.svg)}
      role="img"
      aria-label="IBM 407 control panel, wired for minor totals on the department field"
    >
      <defs>
        <filter id="cordGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="socket" cx="36%" cy="30%">
          <stop offset="0%" stopColor={color.steelHi} />
          <stop offset="55%" stopColor={color.steel} />
          <stop offset="100%" stopColor={color.steelLo} />
        </radialGradient>
      </defs>

      {/* the phenolic board itself */}
      <rect
        x="4"
        y="4"
        width="552"
        height="192"
        rx="3"
        fill={color.machineDeep}
        stroke={color.machineEdge}
        strokeWidth="1.5"
      />
      <rect
        x="10"
        y="10"
        width="540"
        height="180"
        rx="2"
        fill="none"
        stroke={color.machineLo}
        strokeWidth="0.8"
        opacity="0.8"
      />
      {/* the carrying handle, top centre */}
      <rect x="256" y="6" width="48" height="5" rx="2.5" fill={color.steelLo} opacity="0.85" />

      <text
        x="18"
        y="24"
        {...stylex.props(s.label)}
        fill={color.inkOnMachine}
        opacity="0.5"
        letterSpacing="0.16em"
      >
        407 CONTROL PANEL — MINOR TOTALS ON DEPT
      </text>

      {/* cords: an underside stroke first so each has a little thickness */}
      {CORDS.map(([a, b], i) => {
        const d = cordPath(HUBS[a], HUBS[b]);
        const on = live.includes(i);
        return (
          <g key={i} opacity={on ? 1 : 0.5}>
            <path d={d} fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="4.6" transform="translate(0,1.4)" />
            <path
              d={d}
              fill="none"
              stroke={CORDS[i][2]}
              strokeWidth="3.4"
              strokeLinecap="round"
              filter={on ? 'url(#cordGlow)' : undefined}
            />
            <path d={d} fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="0.9" transform="translate(0,-0.9)" />
          </g>
        );
      })}

      {/* sockets */}
      {Object.entries(HUBS).map(([key, h]) => {
        const on = live.some((i) => CORDS[i][0] === key || CORDS[i][1] === key);
        return (
          <g key={key}>
            <circle cx={h.x} cy={h.y} r="4.6" fill="url(#socket)" />
            <circle cx={h.x} cy={h.y} r="2.5" fill={color.machineEdge} />
            {on && <circle cx={h.x} cy={h.y} r="6.6" fill="none" stroke={color.lampAmber} strokeWidth="1" opacity="0.9" />}
            <text
              x={h.anchor === 'end' ? h.x - 8 : h.x + 8}
              y={h.y + 2.4}
              textAnchor={h.anchor}
              {...stylex.props(s.label)}
              fill={on ? color.lampAmber : color.inkOnMachine}
              opacity={on ? 1 : 0.62}
            >
              {h.label}
            </text>
          </g>
        );
      })}

      {cardLabel && (
        <text x="18" y="192" {...stylex.props(s.label)} fill={color.lampAmber} opacity="0.9">
          {cardLabel}
        </text>
      )}
    </svg>
  );
}

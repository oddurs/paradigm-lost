import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { border, radius, space } from '@/design/space.stylex';
import { font, size, tracking } from '@/design/type.stylex';
import { cardColumns, DEPTS, HOLLERITH_ROWS, money, pad, rpad, type Card } from '@/data/deck';

/**
 * An 80-column card, drawn the way one looks: the corner cut off at the top
 * left so a mis-filed card shows up in a stacked deck, the interpretation
 * printed along the top edge by the keypunch, twelve rows of print, and
 * rectangular holes only where this particular record needed them.
 *
 * We punch the first twenty-four columns. The other fifty-six sit unused,
 * exactly as they did on most commercial jobs.
 */

const COLS = 80;
const X0 = 7;
const X1 = 197;
const STEP = (X1 - X0) / COLS;
const Y0 = 20;
const Y1 = 82;
const ROW_STEP = (Y1 - Y0) / (HOLLERITH_ROWS.length - 1);
const HOLE_W = 1.35;
const HOLE_H = 3.6;

const s = stylex.create({
  root: {
    position: 'relative',
    backgroundColor: color.card,
    backgroundImage: texture.cardStock,
    borderRadius: '1px',
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.cardHole,
    boxShadow: depth.sheet,
    color: color.cardInk,
    overflow: 'hidden',
    /* the cut corner, top left */
    clipPath: 'polygon(14px 0, 100% 0, 100% 100%, 0 100%, 0 14px)',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '120ms',
    transform: { default: 'translateY(0)', ':hover': 'translateY(-3px)' },
  },
  caption: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: space.sm,
    paddingInline: space.sm,
    paddingBottom: space.xs,
    paddingTop: '2px',
    fontFamily: font.mono,
    fontSize: size.micro,
    letterSpacing: tracking.plateTight,
    textTransform: 'uppercase',
    opacity: 0.65,
  },
  svg: { width: '100%', height: 'auto', display: 'block' },
});

export function PunchCard({ card }: { card: Card }) {
  const columns = cardColumns(card);
  const interpretation =
    pad(card.name, 11) + pad(DEPTS[card.dept], 9) + rpad(String(card.cents), 6);

  return (
    <div {...stylex.props(s.root)}>
      <svg
        viewBox="0 0 204 92"
        {...stylex.props(s.svg)}
        role="img"
        aria-label={`Punched card: ${card.name}, ${DEPTS[card.dept]}, ${money(card.cents)}`}
      >
        {/* interpretation, printed along the top edge by the keypunch */}
        <text
          x={X0}
          y={11}
          fontFamily="var(--font-mono), monospace"
          fontSize={6}
          fill={color.cardInk}
          opacity={0.88}
          letterSpacing={0.9}
        >
          {interpretation}
        </text>

        {/* the printed digit rows: one text run per row, fitted exactly */}
        {HOLLERITH_ROWS.map((row, r) => {
          if (row === 12 || row === 11) return null;
          return (
            <text
              key={row}
              x={X0}
              y={Y0 + r * ROW_STEP + 1.4}
              fontFamily="var(--font-mono), monospace"
              fontSize={3.1}
              fill={color.cardInk}
              opacity={0.17}
              textLength={X1 - X0}
              lengthAdjust="spacing"
            >
              {String(row).repeat(COLS)}
            </text>
          );
        })}

        {/* the holes actually cut for this record */}
        <g>
          {columns.map((rows, c) =>
            rows.map((row) => {
              const r = HOLLERITH_ROWS.indexOf(row as (typeof HOLLERITH_ROWS)[number]);
              if (r < 0) return null;
              return (
                <rect
                  key={`${c}-${row}`}
                  x={X0 + c * STEP + (STEP - HOLE_W) / 2}
                  y={Y0 + r * ROW_STEP - HOLE_H / 2}
                  width={HOLE_W}
                  height={HOLE_H}
                  rx={0.35}
                  fill={color.cardHole}
                />
              );
            }),
          )}
        </g>

        {/* column 1 is at the right-hand end of the printed field on a real
            card; the little index notch at the bottom right is the stop */}
        <rect x={X1 - 3} y={87} width={3} height={2} fill={color.cardInk} opacity={0.3} />
      </svg>

      <div {...stylex.props(s.caption)}>
        <span>
          {card.name}, {card.initial}.
        </span>
        <span>{money(card.cents)}</span>
      </div>
    </div>
  );
}

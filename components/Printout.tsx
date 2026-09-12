import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { border, space } from '@/design/space.stylex';
import { font, size, tracking } from '@/design/type.stylex';
import type { PrintLine } from '@/data/types';

/**
 * Fanfold greenbar coming off a 1403. Sprocket margins down both sides with
 * the perforation scored beside them, pale and green bands alternating every
 * three lines, and a tear-off across the top.
 *
 * Line height is fixed rather than relative so that the bands and the
 * sprocket holes stay registered with the text, which is the entire reason
 * the paper was ruled this way in the first place.
 */

const LINE = 21; // px — one line at six to the inch, near enough
const BAND = LINE * 3;

const s = stylex.create({
  frame: {
    position: 'relative',
    display: 'flex',
    flex: '1 1 auto',
    minWidth: 0,
    backgroundColor: color.barPale,
    boxShadow: depth.sheet,
    overflow: 'hidden',
  },
  /* every fanfold panel is bounded by a perforation, and the paper
     remembers the fold long after it has been torn off the stack */
  fold: {
    position: 'absolute',
    insetInline: 0,
    height: '6px',
    zIndex: 2,
    pointerEvents: 'none',
    backgroundImage: texture.crease,
  },
  foldTop: { top: 0 },
  foldBottom: { bottom: 0, transform: 'scaleY(-1)' },
  perf: {
    position: 'absolute',
    insetInline: 0,
    height: '1px',
    zIndex: 3,
    pointerEvents: 'none',
    backgroundImage: `repeating-linear-gradient(90deg, ${color.barEdge} 0 3px, rgba(0,0,0,0) 3px 7px)`,
  },
  perfTop: { top: '1px' },
  perfBottom: { bottom: '1px' },
  sprocket: {
    flex: '0 0 22px',
    backgroundColor: color.barPale,
    backgroundImage: `radial-gradient(circle 3.4px at 50% ${LINE / 2}px,
      ${color.barEdge} 98%, transparent 100%)`,
    backgroundSize: `100% ${LINE}px`,
    backgroundRepeat: 'repeat-y',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.06)',
  },
  perfLeft: {
    borderRightWidth: border.hair,
    borderRightStyle: 'dashed',
    borderRightColor: color.barEdge,
  },
  perfRight: {
    borderLeftWidth: border.hair,
    borderLeftStyle: 'dashed',
    borderLeftColor: color.barEdge,
  },
  field: {
    flex: '1 1 auto',
    minWidth: 0,
    minHeight: 0,
    overflowX: 'auto',
    paddingBlock: space.md,
    paddingInline: space.md,
    /* the bands: three lines pale, three lines green */
    backgroundImage: `repeating-linear-gradient(180deg,
      ${color.barGreen} 0 ${BAND}px,
      ${color.barPale} ${BAND}px ${BAND * 2}px)`,
    backgroundPosition: `0 ${space.md}`,
  },
  pre: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: '12.5px',
    lineHeight: `${LINE}px`,
    whiteSpace: 'pre',
    color: color.ink,
    fontVariantNumeric: 'tabular-nums',
    textShadow: depth.struck,
    minHeight: `${LINE * 7}px`,
  },
  grand: {
    fontWeight: 600,
    color: color.marker,
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: color.barEdge,
    display: 'inline-block',
  },
  waiting: {
    fontFamily: font.mono,
    fontSize: size.xs,
    letterSpacing: tracking.caps,
    textTransform: 'uppercase',
    color: color.inkFaint,
    opacity: 0.6,
  },
});

export function Printout({ lines }: { lines: PrintLine[] }) {
  return (
    <div {...stylex.props(s.frame)}>
      <span aria-hidden {...stylex.props(s.fold, s.foldTop)} />
      <span aria-hidden {...stylex.props(s.perf, s.perfTop)} />
      <span aria-hidden {...stylex.props(s.fold, s.foldBottom)} />
      <span aria-hidden {...stylex.props(s.perf, s.perfBottom)} />
      <div aria-hidden {...stylex.props(s.sprocket, s.perfLeft)} />
      <div {...stylex.props(s.field)}>
        <pre {...stylex.props(s.pre)} aria-live="polite" aria-label="Printer output">
          {lines.length === 0 ? (
            <span {...stylex.props(s.waiting)}>— carriage at home, no output —</span>
          ) : (
            lines.map((l, i) =>
              typeof l === 'string' ? (
                <span key={i}>
                  {l}
                  {'\n'}
                </span>
              ) : (
                <span key={i}>
                  {'\n'}
                  <span {...stylex.props(s.grand)}>{l.grand}</span>
                  {'\n'}
                </span>
              ),
            )
          )}
        </pre>
      </div>
      <div aria-hidden {...stylex.props(s.sprocket, s.perfRight)} />
    </div>
  );
}

import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { radius, space, border, motion } from '@/design/space.stylex';
import { font, size, tracking, weight, leading } from '@/design/type.stylex';

/* ------------------------------------------------------------------ *
 * Screw — a slotted pan head. Every panel on a real machine is held on
 * by these, and the slots are never all aligned.
 * ------------------------------------------------------------------ */
const screw = stylex.create({
  base: {
    position: 'absolute',
    width: '11px',
    height: '11px',
    borderRadius: radius.lamp,
    background: `radial-gradient(circle at 34% 30%, ${color.steelHi}, ${color.steel} 46%, ${color.steelLo} 100%)`,
    /* the head, then the countersunk recess it is pulled down into */
    boxShadow:
      'inset 0 -1px 1px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.35), 0 1px 1px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.34), 0 0 3px 1px rgba(0,0,0,0.28)',
    pointerEvents: 'none',
  },
  slot: {
    '::after': {
      content: '""',
      position: 'absolute',
      insetBlock: '4px',
      insetInline: '1px',
      height: '1.5px',
      marginBlock: 'auto',
      background: 'rgba(0,0,0,0.55)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.22)',
    },
  },
  tl: { top: space.sm, left: space.sm },
  tr: { top: space.sm, right: space.sm },
  bl: { bottom: space.sm, left: space.sm },
  br: { bottom: space.sm, right: space.sm },
});

const TURN = [18, -34, 62, -9];

export function Screw({ at, i = 0 }: { at: 'tl' | 'tr' | 'bl' | 'br'; i?: number }) {
  return (
    <span
      aria-hidden
      {...stylex.props(screw.base, screw.slot, screw[at])}
      style={{ transform: `rotate(${TURN[i % TURN.length]}deg)` }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Plate — engraved lettering on a filled panel. Uppercase, letterspaced,
 * and lit from above like a stamped nameplate.
 * ------------------------------------------------------------------ */
const plate = stylex.create({
  root: {
    display: 'inline-block',
    fontFamily: font.plate,
    fontWeight: weight.semi,
    textTransform: 'uppercase',
    letterSpacing: tracking.plate,
    lineHeight: leading.flush,
  },
  onMachine: {
    color: color.inkOnMachine,
    textShadow: '0 1px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(255,255,255,0.10)',
  },
  onPaper: {
    color: color.inkFaint,
    textShadow: 'none',
  },
  onSteel: {
    color: color.machineDeep,
    textShadow: `0 1px 0 rgba(255,255,255,0.55)`,
  },
  marker: { color: color.marker, textShadow: 'none' },
  micro: { fontSize: size.micro },
  xs: { fontSize: size.xs },
  sm: { fontSize: size.sm },
  base: { fontSize: size.base },
});

export function Plate({
  children,
  on = 'machine',
  s = 'xs',
  marker = false,
  id,
}: {
  children: React.ReactNode;
  on?: 'machine' | 'paper' | 'steel';
  s?: 'micro' | 'xs' | 'sm' | 'base';
  marker?: boolean;
  id?: string;
}) {
  return (
    <span
      id={id}
      {...stylex.props(
        plate.root,
        plate[s],
        on === 'machine' ? plate.onMachine : on === 'steel' ? plate.onSteel : plate.onPaper,
        marker && plate.marker,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Lamp — a lens-covered indicator. Dark when off; it does not merely
 * change colour when lit, it throws light onto the panel around it.
 * ------------------------------------------------------------------ */
const lamp = stylex.create({
  base: {
    width: '13px',
    height: '13px',
    borderRadius: radius.lamp,
    flexShrink: 0,
    background: color.lampOff,
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), inset 0 -1px 0 rgba(255,255,255,0.12), 0 1px 0 rgba(255,255,255,0.14)',
    transitionProperty: 'background, box-shadow',
    transitionDuration: motion.lamp,
  },
  red: {
    background: `radial-gradient(circle at 36% 30%, #fff 2%, ${color.lampRed} 44%, #7d2418 100%)`,
    boxShadow: depth.lampGlow,
  },
  amber: {
    background: `radial-gradient(circle at 36% 30%, #fff 2%, ${color.lampAmber} 44%, #7a5411 100%)`,
    boxShadow: '0 0 6px 1px rgba(233,166,60,0.7), 0 0 18px 4px rgba(233,166,60,0.28)',
  },
  green: {
    background: `radial-gradient(circle at 36% 30%, #fff 2%, ${color.lampGreen} 44%, #1f5e2a 100%)`,
    boxShadow: '0 0 6px 1px rgba(107,217,122,0.65), 0 0 18px 4px rgba(107,217,122,0.26)',
  },
});

export function Lamp({ lit, hue = 'red' }: { lit: boolean; hue?: 'red' | 'amber' | 'green' }) {
  return <span aria-hidden {...stylex.props(lamp.base, lit && lamp[hue])} />;
}

/* ------------------------------------------------------------------ *
 * Vent — a louvred cooling grille. These machines ran hot.
 * ------------------------------------------------------------------ */
const vent = stylex.create({
  base: {
    display: 'block',
    position: 'relative',
    height: '30px',
    flex: '1 1 auto',
    minWidth: '60px',
    borderRadius: radius.tool,
    backgroundColor: color.machineDeep,
    backgroundImage: texture.grille,
    boxShadow: depth.insetDeep,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.machineEdge,
    /* the pressed lip around the cut-out */
    '::after': {
      content: '""',
      position: 'absolute',
      inset: '-1px',
      borderRadius: radius.tool,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.5)',
      pointerEvents: 'none',
    },
  },
});

export function Vent() {
  return <span aria-hidden {...stylex.props(vent.base)} />;
}

/* ------------------------------------------------------------------ *
 * RivetRow — domed rivet heads at a regular pitch, the way sheet metal
 * is actually fastened along a run rather than only at the corners.
 * ------------------------------------------------------------------ */
const rivet = stylex.create({
  row: {
    display: 'block',
    height: '9px',
    width: '100%',
    backgroundImage: texture.rivets,
    backgroundSize: '34px 9px',
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'center',
    opacity: 0.72,
    pointerEvents: 'none',
  },
  dense: { backgroundSize: '22px 9px' },
});

export function RivetRow({ dense = false }: { dense?: boolean }) {
  return <span aria-hidden {...stylex.props(rivet.row, dense && rivet.dense)} />;
}

/* ------------------------------------------------------------------ *
 * Seam — the gap where one cabinet panel is bolted against the next.
 * A machine this size was never pressed from a single sheet.
 * ------------------------------------------------------------------ */
const seam = stylex.create({
  base: {
    display: 'block',
    height: '10px',
    width: '100%',
    backgroundImage: texture.seam,
    pointerEvents: 'none',
  },
  riveted: {
    display: 'flex',
    alignItems: 'center',
    height: '14px',
  },
});

export function Seam({ riveted = false }: { riveted?: boolean }) {
  if (!riveted) return <span aria-hidden {...stylex.props(seam.base)} />;
  return (
    <span aria-hidden {...stylex.props(seam.base, seam.riveted)}>
      <RivetRow />
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * DataPlate — the etched tag riveted to every machine, carrying the
 * things a service engineer needed and nobody else ever read.
 * ------------------------------------------------------------------ */
const dataPlate = stylex.create({
  base: {
    position: 'relative',
    display: 'inline-grid',
    gap: '2px',
    maxWidth: '100%',
    paddingBlock: space.md,
    paddingInline: { default: space.xl, '@media (max-width: 560px)': space.base },
    borderRadius: '1px',
    backgroundColor: color.steel,
    backgroundImage: texture.brushed,
    boxShadow: `${depth.raised}, inset 0 0 0 1px rgba(0,0,0,0.28)`,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.machineEdge,
  },
  line: {
    fontFamily: font.mono,
    fontSize: size.xs,
    letterSpacing: tracking.plateTight,
    textTransform: 'uppercase',
    color: color.machineEdge,
    textShadow: '0 1px 0 rgba(255,255,255,0.30)',
    /* an etched plate does not wrap, but the page must not scroll sideways */
    whiteSpace: { default: 'nowrap', '@media (max-width: 560px)': 'normal' },
    overflowWrap: 'anywhere',
  },
});

export function DataPlate({ lines }: { lines: string[] }) {
  return (
    <span {...stylex.props(dataPlate.base)}>
      <Screw at="tl" i={2} />
      <Screw at="br" i={0} />
      {lines.map((l) => (
        <span key={l} {...stylex.props(dataPlate.line)}>
          {l}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Rule — a scored line across a panel or a sheet.
 * ------------------------------------------------------------------ */
const rule = stylex.create({
  base: { border: 'none', height: '1px', margin: 0, width: '100%' },
  onMachine: {
    background: color.machineEdge,
    boxShadow: '0 1px 0 rgba(255,255,255,0.13)',
  },
  onPaper: { background: color.paperEdge, opacity: 0.55 },
});

export function Rule({ on = 'paper' }: { on?: 'machine' | 'paper' }) {
  return <hr {...stylex.props(rule.base, on === 'machine' ? rule.onMachine : rule.onPaper)} />;
}

/* ------------------------------------------------------------------ *
 * Badge — the little riveted tag saying whether a listing really runs.
 * ------------------------------------------------------------------ */
const badge = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
    paddingBlock: '3px',
    paddingInline: space.sm,
    borderRadius: radius.tool,
    fontFamily: font.plate,
    fontSize: size.micro,
    fontWeight: weight.semi,
    textTransform: 'uppercase',
    letterSpacing: tracking.plateTight,
    backgroundImage: texture.brushed,
    backgroundColor: color.steel,
    color: color.machineDeep,
    boxShadow: depth.raised,
    textShadow: '0 1px 0 rgba(255,255,255,0.45)',
  },
  live: { backgroundColor: color.lampGreen },
});

export function Badge({ live, children }: { live?: boolean; children: React.ReactNode }) {
  return <span {...stylex.props(badge.base, live && badge.live)}>{children}</span>;
}

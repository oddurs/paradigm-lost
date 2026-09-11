import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { border, radius, space } from '@/design/space.stylex';
import { Screw } from './Parts';

/* ------------------------------------------------------------------ *
 * Panel — a pressed-steel cabinet face in machine enamel. The whole
 * site's furniture is made of these; paper and printout sit on top.
 * ------------------------------------------------------------------ */
const panel = stylex.create({
  base: {
    position: 'relative',
    backgroundColor: color.machine,
    backgroundImage: texture.enamel,
    borderRadius: radius.moulded,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.machineEdge,
    boxShadow: depth.cabinet,
    color: color.inkOnMachine,
  },
  recessed: {
    backgroundColor: color.machineLo,
    boxShadow: depth.insetDeep,
    borderColor: color.machineEdge,
  },
  dark: {
    backgroundColor: color.machineDeep,
    boxShadow: depth.insetDeep,
  },
  padded: { padding: space.lg },
  tight: { padding: space.md },
  flush: { padding: 0 },
});

export function Panel({
  children,
  tone = 'face',
  pad = 'padded',
  screws = false,
  style,
  as: As = 'div',
  id,
}: {
  children: React.ReactNode;
  tone?: 'face' | 'recessed' | 'dark';
  pad?: 'padded' | 'tight' | 'flush';
  screws?: boolean;
  style?: stylex.StyleXStyles;
  as?: 'div' | 'section' | 'aside' | 'header' | 'footer';
  id?: string;
}) {
  return (
    <As
      id={id}
      {...stylex.props(
        panel.base,
        tone === 'recessed' && panel.recessed,
        tone === 'dark' && panel.dark,
        panel[pad],
        style,
      )}
    >
      {screws && (
        <>
          <Screw at="tl" i={0} />
          <Screw at="tr" i={1} />
          <Screw at="bl" i={2} />
          <Screw at="br" i={3} />
        </>
      )}
      {children}
    </As>
  );
}

/* ------------------------------------------------------------------ *
 * Sheet — bond paper laid on the machine. Everything a human wrote
 * lives on one of these; everything the machine said does not.
 * ------------------------------------------------------------------ */
const sheet = stylex.create({
  base: {
    position: 'relative',
    minWidth: 0,
    backgroundColor: color.paper,
    backgroundImage: texture.paper,
    color: color.ink,
    boxShadow: depth.sheet,
    borderRadius: '1px',
    borderTopWidth: border.hair,
    borderTopStyle: 'solid',
    borderTopColor: color.paperHi,
  },
  padded: { padding: { default: space.xl, '@media (max-width: 480px)': space.base } },
  tight: { padding: { default: space.lg, '@media (max-width: 480px)': space.base } },
  flush: { padding: 0 },
  /* the faint punched-hole margin of a filing sheet */
  filed: {
    '::before': {
      content: '""',
      position: 'absolute',
      left: space.md,
      top: 0,
      bottom: 0,
      width: '1px',
      background: color.marker,
      opacity: 0.28,
    },
  },
});

export function Sheet({
  children,
  pad = 'padded',
  filed = false,
  style,
  as: As = 'div',
  id,
}: {
  children: React.ReactNode;
  pad?: 'padded' | 'tight' | 'flush';
  filed?: boolean;
  style?: stylex.StyleXStyles;
  as?: 'div' | 'section' | 'article' | 'aside';
  id?: string;
}) {
  return (
    <As id={id} {...stylex.props(sheet.base, sheet[pad], filed && sheet.filed, style)}>
      {children}
    </As>
  );
}

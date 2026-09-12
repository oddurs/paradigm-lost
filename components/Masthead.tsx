import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { border, radius, space } from '@/design/space.stylex';
import { font, leading, size, tracking, weight } from '@/design/type.stylex';
import { Wrap } from '@/components/primitives/Layout';
import { Lamp, RivetRow, Screw, Vent } from '@/components/primitives/Parts';
import { EXHIBITS } from '@/data/exhibits';

/**
 * The machine's name plate, bolted across the top of the cabinet: a strip of
 * brushed steel with the model name engraved into it, a lamp cluster, and a
 * louvred vent. The exhibit index is screened on below it.
 */
const s = stylex.create({
  bar: {
    position: 'relative',
    backgroundColor: color.machineLo,
    backgroundImage: texture.enamel,
    borderBottomWidth: border.frame,
    borderBottomStyle: 'solid',
    borderBottomColor: color.machineEdge,
    boxShadow: '0 4px 14px -4px rgba(0,0,0,0.55)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: space.lg,
    flexWrap: 'wrap',
    paddingBlock: space.md,
  },
  plateBlock: {
    position: 'relative',
    paddingBlock: space.sm,
    paddingInline: space.lg,
    borderRadius: radius.tool,
    backgroundColor: color.steel,
    backgroundImage: texture.brushed,
    boxShadow: depth.raisedHard,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.steelLo,
  },
  name: {
    display: 'block',
    fontFamily: font.plate,
    fontSize: size.lg,
    fontWeight: weight.bold,
    letterSpacing: tracking.plate,
    textTransform: 'uppercase',
    lineHeight: leading.flush,
    color: color.machineDeep,
    textShadow: '0 1px 0 rgba(255,255,255,0.6), 0 -1px 0 rgba(0,0,0,0.28)',
  },
  nameLost: { color: color.marker },
  model: {
    display: 'block',
    marginTop: '3px',
    fontFamily: font.mono,
    fontSize: size.micro,
    letterSpacing: tracking.plateTight,
    color: color.steelLo,
    textShadow: '0 1px 0 rgba(255,255,255,0.45)',
  },
  lamps: { display: 'flex', gap: space.sm, alignItems: 'center' },
  lampLabel: {
    fontFamily: font.plate,
    fontSize: size.micro,
    letterSpacing: tracking.plate,
    textTransform: 'uppercase',
    color: color.inkOnMachine,
    opacity: 0.72,
  },
  ventBox: { display: 'flex', flex: '0 1 200px', minWidth: '80px', maxWidth: '240px', alignItems: 'center', marginLeft: 'auto' },
  index: {
    borderTopWidth: border.hair,
    borderTopStyle: 'solid',
    borderTopColor: color.machineEdge,
    backgroundColor: color.machineDeep,
  },
  indexInner: {
    display: 'flex',
    gap: space.md,
    flexWrap: 'wrap',
    alignItems: 'baseline',
    paddingBlock: space.sm,
  },
  indexLabel: {
    fontFamily: font.plate,
    fontSize: size.micro,
    letterSpacing: tracking.plate,
    textTransform: 'uppercase',
    color: color.inkOnMachine,
    opacity: 0.5,
    marginRight: space.xs,
  },
  link: {
    fontFamily: font.mono,
    fontSize: size.xs,
    letterSpacing: tracking.caps,
    textDecoration: 'none',
    color: { default: color.inkOnMachine, ':hover': color.lampAmber },
    opacity: { default: 0.82, ':hover': 1 },
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: { default: 'transparent', ':hover': color.lampAmber },
    paddingBottom: '1px',
    outlineOffset: '3px',
  },
  year: { color: color.inkFaint, opacity: 0.6, marginRight: '4px' },
});

export function Masthead() {
  return (
    <header>
      <div {...stylex.props(s.bar)}>
        <Wrap>
          <div {...stylex.props(s.inner)}>
            <div {...stylex.props(s.plateBlock)}>
              <Screw at="tl" i={1} />
              <Screw at="br" i={3} />
              <span {...stylex.props(s.name)}>
                Paradigm <span {...stylex.props(s.nameLost)}>Lost</span>
              </span>
              <span {...stylex.props(s.model)}>
                TOTAL BY DEPARTMENT · MODEL 1935—2026 · 11 EXHIBITS
              </span>
            </div>

            <div {...stylex.props(s.lamps)}>
              <Lamp lit hue="green" />
              <span {...stylex.props(s.lampLabel)}>power</span>
              <Lamp lit hue="amber" />
              <span {...stylex.props(s.lampLabel)}>ready</span>
              <Lamp lit={false} />
              <span {...stylex.props(s.lampLabel)}>check</span>
            </div>

            <div {...stylex.props(s.ventBox)}>
              <Vent />
            </div>
          </div>
          <RivetRow />
        </Wrap>
      </div>

      <nav {...stylex.props(s.index)} aria-label="Exhibits">
        <Wrap>
          <div {...stylex.props(s.indexInner)}>
            <span {...stylex.props(s.indexLabel)}>Index</span>
            {EXHIBITS.map((e) => (
              <a key={e.id} href={`#${e.id}`} {...stylex.props(s.link)}>
                <span {...stylex.props(s.year)}>{e.year}</span>
                {e.nav}
              </a>
            ))}
          </div>
        </Wrap>
      </nav>
    </header>
  );
}

import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { border, measure, radius, space } from '@/design/space.stylex';
import { font, leading, size, tracking, weight } from '@/design/type.stylex';
import { Wrap } from '@/components/primitives/Layout';
import { Sheet } from '@/components/primitives/Surfaces';
import { Screw, Seam } from '@/components/primitives/Parts';
import { Listing } from '@/components/Listing';
import { MachineStrip } from '@/components/MachineStrip';
import type { Exhibit as ExhibitData } from '@/data/types';

const s = stylex.create({
  panel: { scrollMarginTop: space.base },
  band: { paddingBlock: space.section },
  head: {
    display: 'grid',
    gridTemplateColumns: { default: '132px minmax(0, 1fr)', '@media (max-width: 760px)': 'minmax(0, 1fr)' },
    gap: space.xl,
    alignItems: 'start',
    marginBottom: space.xl,
  },

  /* the year, stamped into a steel plate screwed to the cabinet */
  yearPlate: {
    position: 'relative',
    paddingBlock: space.md,
    paddingInline: space.md,
    borderRadius: radius.tool,
    backgroundColor: color.steel,
    backgroundImage: texture.brushed,
    boxShadow: depth.raisedHard,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.steelLo,
    textAlign: 'center',
  },
  year: {
    display: 'block',
    fontFamily: font.plate,
    fontSize: size.year,
    fontWeight: weight.bold,
    letterSpacing: tracking.plateTight,
    lineHeight: leading.flush,
    color: color.machineDeep,
    textShadow: '0 1px 0 rgba(255,255,255,0.62), 0 -1px 0 rgba(0,0,0,0.3)',
    fontVariantNumeric: 'tabular-nums',
  },
  ordinal: {
    display: 'block',
    marginTop: space.xs,
    fontFamily: font.mono,
    fontSize: size.micro,
    letterSpacing: tracking.plateTight,
    textTransform: 'uppercase',
    color: color.steelLo,
    textShadow: '0 1px 0 rgba(255,255,255,0.45)',
  },

  h2: {
    fontFamily: font.display,
    fontSize: size.title,
    fontVariationSettings: '"opsz" 40',
    fontWeight: weight.semi,
    letterSpacing: tracking.display,
    lineHeight: leading.tight,
    textWrap: 'balance',
    color: color.inkOnMachine,
    textShadow: '0 1px 0 rgba(0,0,0,0.45)',
    marginBottom: space.sm,
    maxWidth: '20ch',
  },
  who: {
    fontFamily: font.mono,
    fontSize: size.xs,
    letterSpacing: tracking.caps,
    color: color.inkOnMachine,
    opacity: 0.6,
  },
  claim: {
    marginTop: space.base,
    paddingLeft: space.base,
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    borderLeftColor: color.lampAmber,
    fontFamily: font.display,
    fontStyle: 'italic',
    fontSize: size.lg,
    fontVariationSettings: '"opsz" 24',
    lineHeight: leading.snug,
    color: color.inkOnMachine,
    maxWidth: '46ch',
    textShadow: '0 1px 0 rgba(0,0,0,0.35)',
  },

  body: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1.06fr) minmax(0, 0.94fr)',
      '@media (max-width: 1040px)': 'minmax(0, 1fr)',
    },
    gap: space.lg,
    alignItems: 'start',
    marginBottom: space.lg,
  },

  notes: {
    '--prose-mono': font.mono,
    '--prose-code-bg': color.paperLo,
    '--prose-code-edge': color.paperEdge,
    '--prose-strong': color.ink,
  },
  note: {
    fontSize: size.base,
    lineHeight: leading.body,
    color: color.inkSoft,
    maxWidth: measure.prose,
    marginBottom: space.md,
  },

  ledger: {
    marginTop: space.lg,
    borderTopWidth: border.hair,
    borderTopStyle: 'solid',
    borderTopColor: color.paperEdge,
  },
  entry: {
    display: 'grid',
    gridTemplateColumns: '74px minmax(0, 1fr)',
    gap: space.md,
    alignItems: 'baseline',
    paddingBlock: space.sm,
    borderBottomWidth: border.hair,
    borderBottomStyle: 'solid',
    borderBottomColor: color.paperEdge,
    fontSize: size.sm,
    lineHeight: leading.snug,
    color: color.inkSoft,
  },
  tag: {
    fontFamily: font.plate,
    fontSize: size.micro,
    letterSpacing: tracking.plate,
    textTransform: 'uppercase',
  },
  tagFree: { color: color.ink },
  tagCostly: { color: color.marker },
});

export function Exhibit({ data, ordinal, of }: { data: ExhibitData; ordinal: number; of: number }) {
  const steps = data.trace();
  const notesProps = stylex.props(s.notes);

  return (
    <section id={data.id} {...stylex.props(s.panel)}>
      <Seam riveted />
      <Wrap style={s.band}>
        <div {...stylex.props(s.head)}>
          <div {...stylex.props(s.yearPlate)}>
            <Screw at="tl" i={ordinal} />
            <Screw at="br" i={ordinal + 1} />
            <span {...stylex.props(s.year)}>{data.year}</span>
            <span {...stylex.props(s.ordinal)}>
              Exhibit {String(ordinal).padStart(2, '0')}/{of}
            </span>
          </div>

          <div>
            <h2 {...stylex.props(s.h2)}>{data.title}</h2>
            <div {...stylex.props(s.who)}>{data.who}</div>
            <p {...stylex.props(s.claim)}>{data.claim}</p>
          </div>
        </div>

        <div {...stylex.props(s.body)}>
          <Listing code={data.code} lang={data.lang} executes={data.executes} />

          <Sheet pad="tight">
            <div className={`prose ${notesProps.className ?? ''}`} style={notesProps.style}>
              {data.notes.map((n, i) => (
                <p key={i} {...stylex.props(s.note)} dangerouslySetInnerHTML={{ __html: n }} />
              ))}

              <div {...stylex.props(s.ledger)}>
                {data.costs.map((c) => (
                  <div key={c.kind} {...stylex.props(s.entry)}>
                    <span {...stylex.props(s.tag, c.kind === 'free' ? s.tagFree : s.tagCostly)}>
                      {c.kind === 'free' ? 'Free' : 'Costly'}
                    </span>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Sheet>
        </div>

        <MachineStrip steps={steps} isBoard={data.id === 'plugboard'} />
      </Wrap>
    </section>
  );
}

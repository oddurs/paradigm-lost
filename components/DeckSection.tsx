import * as stylex from '@stylexjs/stylex';
import { color } from '@/design/tokens.stylex';
import { measure, space } from '@/design/space.stylex';
import { font, leading, size, tracking, weight } from '@/design/type.stylex';
import { Wrap } from '@/components/primitives/Layout';
import { Plate } from '@/components/primitives/Parts';
import { PunchCard } from '@/components/PunchCard';
import { DECK, DEPTS, GRAND, money } from '@/data/deck';

const s = stylex.create({
  band: { paddingBlock: space.xxl },
  head: {
    display: 'flex',
    alignItems: 'baseline',
    gap: space.base,
    flexWrap: 'wrap',
    marginBottom: space.sm,
  },
  h2: {
    fontFamily: font.display,
    fontSize: size.xl,
    fontVariationSettings: '"opsz" 32',
    fontWeight: weight.semi,
    letterSpacing: tracking.display,
    lineHeight: leading.tight,
    color: color.inkOnMachine,
    textShadow: '0 1px 0 rgba(0,0,0,0.4)',
  },
  lede: {
    maxWidth: measure.prose,
    color: color.inkOnMachine,
    opacity: 0.84,
    marginBottom: space.xl,
    fontSize: size.base,
    lineHeight: leading.body,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))',
    gap: space.md,
  },
  foot: {
    marginTop: space.lg,
    display: 'flex',
    gap: space.lg,
    flexWrap: 'wrap',
    alignItems: 'baseline',
    fontFamily: font.mono,
    fontSize: size.xs,
    lineHeight: leading.loose,
    color: color.inkOnMachine,
    opacity: 0.66,
    maxWidth: '86ch',
    letterSpacing: tracking.caps,
  },
  strong: { color: color.lampAmber, opacity: 1 },
});

export function DeckSection() {
  return (
    <Wrap as="section" style={s.band} id="deck">
      <div {...stylex.props(s.head)}>
        <h2 {...stylex.props(s.h2)}>The deck</h2>
        <Plate s="micro">12 cards · 24 columns punched · input to all eleven</Plate>
      </div>

      <p {...stylex.props(s.lede)}>
        A payroll register from a firm that never existed, staffed entirely by people who did.
        Twelve 80-column cards, punched in three fields: name in columns 1–10, department in 11–18,
        amount in 19–24 with an implied decimal. Every exhibit below reads exactly this.
      </p>

      <div {...stylex.props(s.grid)}>
        {DECK.map((card, i) => (
          <PunchCard key={card.name} card={card} index={i} />
        ))}
      </div>

      <p {...stylex.props(s.foot)}>
        <span>
          Presorted on the department field — four of the eleven programs below simply will not work
          otherwise. Four departments, twelve records, grand total{' '}
          <span {...stylex.props(s.strong)}>{money(GRAND)}</span>. Departments: {DEPTS.join(' · ')}.
        </span>
      </p>
    </Wrap>
  );
}

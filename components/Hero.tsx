import * as stylex from '@stylexjs/stylex';
import { color } from '@/design/tokens.stylex';
import { measure, space } from '@/design/space.stylex';
import { font, leading, size, tracking, weight } from '@/design/type.stylex';
import { Wrap } from '@/components/primitives/Layout';
import { Sheet } from '@/components/primitives/Surfaces';
import { Rule } from '@/components/primitives/Parts';

const s = stylex.create({
  band: { paddingBlock: space.xxl },
  sheet: { maxWidth: '980px' },
  eyebrow: {
    fontFamily: font.plate,
    fontSize: size.xs,
    fontWeight: weight.semi,
    letterSpacing: tracking.plate,
    textTransform: 'uppercase',
    color: color.marker,
    display: 'block',
    marginBottom: space.lg,
  },
  h1: {
    fontFamily: font.display,
    fontSize: size.hero,
    fontVariationSettings: '"opsz" 60',
    fontWeight: weight.semi,
    lineHeight: leading.flush,
    letterSpacing: tracking.hero,
    textWrap: 'balance',
    maxWidth: '15ch',
    marginBottom: space.lg,
    color: color.ink,
  },
  thin: {
    fontStyle: 'italic',
    fontWeight: weight.regular,
    color: color.inkSoft,
  },
  standfirst: {
    fontSize: size.md,
    lineHeight: leading.snug,
    maxWidth: measure.prose,
    color: color.inkSoft,
    marginBottom: space.base,
    fontVariationSettings: '"opsz" 22',
  },
  em: { color: color.ink, fontWeight: weight.semi },
  ital: { fontStyle: 'italic' },
  divider: { marginBlock: space.lg, maxWidth: '260px' },
});

export function Hero() {
  return (
    <Wrap as="section" style={s.band}>
      <Sheet style={s.sheet}>
        <span {...stylex.props(s.eyebrow)}>Eleven ways to add up a column of numbers</span>

        <h1 {...stylex.props(s.h1)}>
          The same problem,
          <br />
          <span {...stylex.props(s.thin)}>ninety years apart</span>
        </h1>

        <div {...stylex.props(s.divider)}>
          <Rule />
        </div>

        <p {...stylex.props(s.standfirst)}>
          Every program on this page does one thing:{' '}
          <span {...stylex.props(s.em)}>total the amounts by department and print a report.</span>{' '}
          The problem never changes. What changes is what a programmer thought a program{' '}
          <span {...stylex.props(s.ital)}>was</span> — a wiring diagram, a deck of cards, a stack, a
          matrix, a set of facts, a sentence.
        </p>

        <p {...stylex.props(s.standfirst)}>
          Each exhibit runs its own execution model in the console beneath it, because these
          machines do not merely spell one algorithm differently. They hold different things in
          their hands while they work.
        </p>

        <p {...stylex.props(s.standfirst)}>
          Read down and something odd happens. The 1935 machine and the 1974 database{' '}
          <span {...stylex.props(s.em)}>express the same idea</span>, and the forty years in between
          are spent writing by hand what both of them got for free.
        </p>
      </Sheet>
    </Wrap>
  );
}

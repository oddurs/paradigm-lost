import * as stylex from '@stylexjs/stylex';
import { measure, space } from '@/design/space.stylex';

const layout = stylex.create({
  wrap: {
    width: '100%',
    maxWidth: measure.page,
    marginInline: 'auto',
    paddingInline: { default: space.gutter, '@media (max-width: 480px)': space.base },
  },
  stack: { display: 'flex', flexDirection: 'column' },
  row: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' },
  gapXs: { gap: space.xs },
  gapSm: { gap: space.sm },
  gapMd: { gap: space.md },
  gapBase: { gap: space.base },
  gapLg: { gap: space.lg },
  gapXl: { gap: space.xl },
  center: { alignItems: 'center' },
  baseline: { alignItems: 'baseline' },
  between: { justifyContent: 'space-between' },
});

type Gap = 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl';
const GAP = {
  xs: layout.gapXs,
  sm: layout.gapSm,
  md: layout.gapMd,
  base: layout.gapBase,
  lg: layout.gapLg,
  xl: layout.gapXl,
} as const;

export function Wrap({
  children,
  style,
  as: As = 'div',
  id,
}: {
  children: React.ReactNode;
  style?: stylex.StyleXStyles;
  as?: 'div' | 'section' | 'header' | 'footer' | 'main';
  id?: string;
}) {
  return (
    <As id={id} {...stylex.props(layout.wrap, style)}>
      {children}
    </As>
  );
}

export function Stack({
  children,
  gap = 'base',
  style,
}: {
  children: React.ReactNode;
  gap?: Gap;
  style?: stylex.StyleXStyles;
}) {
  return <div {...stylex.props(layout.stack, GAP[gap], style)}>{children}</div>;
}

export function Row({
  children,
  gap = 'base',
  align,
  between,
  style,
}: {
  children: React.ReactNode;
  gap?: Gap;
  align?: 'center' | 'baseline';
  between?: boolean;
  style?: stylex.StyleXStyles;
}) {
  return (
    <div
      {...stylex.props(
        layout.row,
        GAP[gap],
        align === 'center' && layout.center,
        align === 'baseline' && layout.baseline,
        between && layout.between,
        style,
      )}
    >
      {children}
    </div>
  );
}

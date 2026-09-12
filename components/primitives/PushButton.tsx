import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { border, motion, radius, space } from '@/design/space.stylex';
import { font, size, tracking, weight } from '@/design/type.stylex';

/**
 * An illuminated console pushbutton: bakelite surround, translucent cap,
 * legend screened on the cap. It travels about a millimetre when pressed,
 * and the light is behind the legend rather than around it.
 */
const btn = stylex.create({
  base: {
    position: 'relative',
    appearance: 'none',
    cursor: { default: 'pointer', ':disabled': 'default' },
    minWidth: { default: '78px', '@media (max-width: 480px)': '62px' },
    padding: '2px',
    borderRadius: radius.moulded,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.machineEdge,
    backgroundColor: color.bakelite,
    backgroundImage: texture.bakelite,
    boxShadow: {
      default: `${depth.raisedHard}, 0 3px 0 rgba(0,0,0,0.45)`,
      ':active': depth.inset,
      ':disabled': depth.inset,
    },
    transform: { default: 'translateY(0)', ':active': 'translateY(2px)' },
    transitionProperty: 'transform, box-shadow',
    transitionDuration: motion.relay,
    opacity: { default: 1, ':disabled': 0.42 },
  },
  cap: {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
    paddingBlock: space.sm,
    paddingInline: { default: space.md, '@media (max-width: 480px)': space.sm },
    borderRadius: '2px',
    fontFamily: font.plate,
    fontSize: size.xs,
    fontWeight: weight.bold,
    letterSpacing: tracking.plate,
    textTransform: 'uppercase',
    lineHeight: 1,
    color: color.inkOnMachine,
    background: `linear-gradient(180deg, ${color.bakeliteHi}, ${color.bakelite})`,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -2px 4px rgba(0,0,0,0.5)',
    textShadow: '0 -1px 0 rgba(0,0,0,0.7)',
    transitionProperty: 'color, background, text-shadow',
    transitionDuration: motion.lamp,
    /* the gloss sitting on the top half of the moulding */
    '::after': {
      content: '""',
      position: 'absolute',
      insetInline: 0,
      top: 0,
      height: '46%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.17), rgba(255,255,255,0))',
      pointerEvents: 'none',
    },
  },
  /* lit from behind: the legend glows, the cap warms */
  litRed: {
    color: '#FFE9E2',
    background: `linear-gradient(180deg, #C8442F, #8E2A1B)`,
    textShadow: '0 0 8px rgba(255,150,120,0.95), 0 -1px 0 rgba(0,0,0,0.45)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -2px 5px rgba(0,0,0,0.42)',
  },
  litAmber: {
    color: '#FFF3DA',
    background: `linear-gradient(180deg, #B98424, #7C5512)`,
    textShadow: '0 0 8px rgba(255,208,120,0.95), 0 -1px 0 rgba(0,0,0,0.45)',
  },
  focus: {
    outlineWidth: '2px',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineColor: color.lampAmber,
    outlineOffset: '3px',
  },
});

export function PushButton({
  children,
  onClick,
  disabled,
  lit,
  hue = 'red',
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  lit?: boolean;
  hue?: 'red' | 'amber';
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      {...stylex.props(btn.base, btn.focus)}
    >
      <span {...stylex.props(btn.cap, lit && (hue === 'red' ? btn.litRed : btn.litAmber))}>
        {children}
      </span>
    </button>
  );
}

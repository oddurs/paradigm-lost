import * as stylex from '@stylexjs/stylex';

const DARK = '@media (prefers-color-scheme: dark)';

/**
 * Materials. The palette is a machine room, not a colour wheel: enamelled
 * steel cabinets in the grey-green every manufacturer used between roughly
 * 1955 and 1975, bond paper, fanfold greenbar, manila card stock, bakelite,
 * brass, and phosphor. Every colour below is a thing you could have touched.
 */
export const color = stylex.defineVars({
  /* ---- cabinet enamel: the signature machine green ---- */
  machine: { default: '#5C7061', [DARK]: '#1F2822' },
  machineHi: { default: '#889C8A', [DARK]: '#36423A' },
  machineLo: { default: '#3B4941', [DARK]: '#161D19' },
  machineDeep: { default: '#232C26', [DARK]: '#0C110E' },
  machineEdge: { default: '#1B221D', [DARK]: '#060907' },

  /* ---- bond paper: listings, prose, the page itself ---- */
  paper: { default: '#EDE8D9', [DARK]: '#242A26' },
  paperHi: { default: '#F8F5EC', [DARK]: '#303731' },
  paperLo: { default: '#DBD4C0', [DARK]: '#1C211E' },
  paperEdge: { default: '#B9B29B', [DARK]: '#3A433C' },

  /* ---- fanfold greenbar, the 1403 line printer ---- */
  barPale: { default: '#F3F6EC', [DARK]: '#1C2620' },
  barGreen: { default: '#D3E3C7', [DARK]: '#243329' },
  barEdge: { default: '#AFC4A2', [DARK]: '#2F4034' },

  /* ---- 80-column card stock ---- */
  card: { default: '#D9C8A3', [DARK]: '#4C4438' },
  cardHi: { default: '#EADCBB', [DARK]: '#5C5340' },
  cardInk: { default: '#544628', [DARK]: '#CBB78C' },
  cardHole: { default: '#6A5B3B', [DARK]: '#0E0C09' },

  /* ---- brushed steel: bezels, plates, hinges ---- */
  steel: { default: '#B3B8AF', [DARK]: '#767C74' },
  steelHi: { default: '#DEE1DA', [DARK]: '#9AA098' },
  steelLo: { default: '#7C827A', [DARK]: '#4A4F49' },
  brass: { default: '#B08B45', [DARK]: '#C79E4E' },

  /* ---- bakelite: knobs, switch bodies, button surrounds ---- */
  bakelite: { default: '#211D19', [DARK]: '#151210' },
  bakeliteHi: { default: '#453C33', [DARK]: '#302A24' },

  /* ---- the tube ---- */
  crt: { default: '#08110D', [DARK]: '#050C09' },
  phosphor: { default: '#8AF08E', [DARK]: '#8AF08E' },
  phosphorDim: { default: '#3E7C46', [DARK]: '#356B3C' },

  /* ---- ink on paper ---- */
  ink: { default: '#191E1A', [DARK]: '#DCE2D8' },
  inkSoft: { default: '#4C554E', [DARK]: '#9BA69C' },
  inkFaint: { default: '#7A8478', [DARK]: '#6E786F' },
  inkOnMachine: { default: '#E6EBE2', [DARK]: '#C3CCC1' },

  /* ---- signal: form-marker red, indicator lamps ---- */
  marker: { default: '#A2372A', [DARK]: '#D9614D' },
  lampOff: { default: '#5E2B24', [DARK]: '#3E1E19' },
  lampRed: { default: '#F2604A', [DARK]: '#FF6E55' },
  lampAmber: { default: '#E9A63C', [DARK]: '#F0AE44' },
  lampGreen: { default: '#6BD97A', [DARK]: '#77E585' },
});

/**
 * Bevels and lifts. Skeuomorphism is mostly a discipline about where the
 * light is: one source, upper-left, consistent on every part.
 */
export const depth = stylex.defineVars({
  /* a part that stands proud of its surroundings */
  raised:
    'inset 1px 1px 0 rgba(255,255,255,0.30), inset -1px -1px 0 rgba(0,0,0,0.34), 0 2px 3px rgba(0,0,0,0.22)',
  raisedHard:
    'inset 1px 1px 0 rgba(255,255,255,0.42), inset -2px -2px 0 rgba(0,0,0,0.30), 0 3px 6px rgba(0,0,0,0.30)',
  /* a part pressed in, or a recess cut into a panel */
  inset:
    'inset 2px 3px 6px rgba(0,0,0,0.42), inset -1px -1px 0 rgba(255,255,255,0.16)',
  insetDeep:
    'inset 3px 4px 10px rgba(0,0,0,0.58), inset -1px -1px 0 rgba(255,255,255,0.12)',
  /* a whole cabinet, bolted to the one above it */
  cabinet:
    '0 1px 0 rgba(255,255,255,0.14), 0 14px 30px -12px rgba(0,0,0,0.55), 0 3px 8px -3px rgba(0,0,0,0.35)',

  /* paper: a sheet does not float, it rests, and it is thicker at one edge */
  sheet: {
    default:
      '0 1px 0 rgba(255,255,255,0.62), 0 1px 1px rgba(0,0,0,0.10), 0 3px 5px -2px rgba(0,0,0,0.20), 0 14px 26px -14px rgba(0,0,0,0.40)',
    [DARK]:
      '0 1px 0 rgba(255,255,255,0.05), 0 1px 1px rgba(0,0,0,0.5), 0 3px 6px -2px rgba(0,0,0,0.55), 0 16px 30px -14px rgba(0,0,0,0.75)',
  },
  /* the lift a sheet gets where a corner has curled away from the desk */
  sheetCurl: {
    default: '0 18px 22px -20px rgba(0,0,0,0.62)',
    [DARK]: '0 18px 24px -20px rgba(0,0,0,0.85)',
  },

  /* a lit indicator lamp, throwing light onto the panel around it */
  lampGlow: '0 0 6px 1px rgba(242,96,74,0.7), 0 0 18px 4px rgba(242,96,74,0.30)',

  /* engraved into filled metal, or letterpressed into paper */
  engraved: '0 1px 0 rgba(255,255,255,0.34)',
  engravedDark: '0 -1px 0 rgba(0,0,0,0.5)',
  letterpress: {
    default: '0 1px 0 rgba(255,255,255,0.72)',
    [DARK]: '0 -1px 0 rgba(0,0,0,0.62)',
  },
  /* struck by a printer hammer through an inked ribbon: never quite clean */
  struck: {
    default: '0 0 0.6px rgba(25,30,26,0.55)',
    [DARK]: '0 0 0.7px rgba(220,226,216,0.4)',
  },
  none: 'none',
});

/**
 * Surface textures. Real materials are never flat, so nothing here is.
 * Each value is a complete `background-image` list, layered coarse over fine.
 */
export const texture = stylex.defineVars({
  /* paper fibre: fine fractal grain plus a faint laid pattern */
  paper:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23p)' opacity='0.34'/%3E%3C/svg%3E\"), repeating-linear-gradient(0deg, rgba(0,0,0,0.014) 0 1px, transparent 1px 4px)",

  /* enamel over sheet steel: a fine sandblasted finish, sprayed not brushed */
  enamel:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='e'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23e)' opacity='0.13'/%3E%3C/svg%3E\"), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.7' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23f)' opacity='0.10'/%3E%3C/svg%3E\")",

  /* brushed aluminium: directional grain */
  brushed:
    'repeating-linear-gradient(92deg, rgba(255,255,255,0.10) 0 1px, rgba(0,0,0,0.055) 1px 2px, rgba(255,255,255,0.04) 2px 3px)',

  /* card stock: coarser, softer fibre than bond */
  cardStock:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='130'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='130' height='130' filter='url(%23c)' opacity='0.30'/%3E%3C/svg%3E\")",

  /* the tube: scanlines plus the shadow-mask shimmer */
  scanlines:
    'repeating-linear-gradient(0deg, rgba(0,0,0,0.42) 0 1px, rgba(0,0,0,0) 1px 3px)',

  /* bakelite: near-black with a fine speckle */
  bakelite:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='90' height='90' filter='url(%23b)' opacity='0.22'/%3E%3C/svg%3E\")",

  /* a louvred cooling grille, pressed into the panel */
  grille:
    'repeating-linear-gradient(180deg, rgba(0,0,0,0.55) 0 1px, rgba(0,0,0,0.30) 1px 2px, rgba(255,255,255,0.09) 2px 3px, rgba(0,0,0,0) 3px 7px)',

  /* a row of domed rivet heads along a seam */
  rivets:
    'radial-gradient(circle 3.2px at 50% 50%, rgba(255,255,255,0.42) 0 22%, rgba(150,158,148,0.9) 23% 52%, rgba(0,0,0,0.55) 53% 78%, rgba(0,0,0,0) 79%)',

  /* the specular sheen sitting on the face of a curved tube */
  glassSheen:
    'linear-gradient(122deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.045) 14%, rgba(255,255,255,0.012) 26%, rgba(255,255,255,0) 42%)',

  /* the accordion crease across a sheet of fanfold */
  crease:
    'linear-gradient(180deg, rgba(0,0,0,0.16) 0, rgba(0,0,0,0.05) 2px, rgba(255,255,255,0.30) 3px, rgba(0,0,0,0) 6px)',

  /* the seam where one cabinet panel is bolted against the next */
  seam:
    'linear-gradient(180deg, rgba(0,0,0,0) 0, rgba(0,0,0,0.34) 34%, rgba(0,0,0,0.52) 50%, rgba(255,255,255,0.11) 62%, rgba(255,255,255,0.03) 70%, rgba(0,0,0,0) 100%)',

  none: 'none',
});

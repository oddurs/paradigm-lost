import * as stylex from '@stylexjs/stylex';

/**
 * Three voices, and they never trade jobs.
 *
 *  display — Newsreader, an editorial serif with an optical-size axis. Used at
 *            two optical sizes rather than two families: the actual craft move.
 *  plate   — Saira Condensed. The engraved lettering on a machine's name plate.
 *            Always uppercase, always letterspaced, never running text.
 *  mono    — IBM Plex Mono. Anything the machine itself said.
 */
export const font = stylex.defineVars({
  display: "var(--font-display), 'Iowan Old Style', Georgia, serif",
  plate: "var(--font-plate), 'Helvetica Neue Condensed', Impact, sans-serif",
  mono: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
});

export const size = stylex.defineVars({
  /* fixed steps, ~1.26 ratio */
  micro: '10.5px',
  xs: '11.5px',
  sm: '13px',
  base: '16.75px',
  md: '18.5px',
  lg: '21.5px',
  xl: '26px',
  xxl: '33px',
  /* fluid display steps */
  title: 'clamp(30px, 4.2vw, 44px)',
  hero: 'clamp(44px, 8.2vw, 92px)',
  year: 'clamp(30px, 3.6vw, 42px)',
});

export const leading = stylex.defineVars({
  flush: '1',
  tight: '1.14',
  snug: '1.32',
  body: '1.62',
  loose: '1.78',
  /* line printer: six lines per inch, and it shows */
  printer: '1.66',
});

export const tracking = stylex.defineVars({
  /* engraved plates need air or the letters weld together */
  plate: '0.16em',
  plateTight: '0.09em',
  caps: '0.06em',
  normal: '0',
  display: '-0.021em',
  hero: '-0.032em',
});

export const weight = stylex.defineVars({
  regular: '400',
  medium: '500',
  semi: '600',
  bold: '700',
});

/** Optical size, the reason there is only one serif on this page. */
export const optical = stylex.defineVars({
  text: '"opsz" 16',
  subhead: '"opsz" 28',
  display: '"opsz" 60',
});

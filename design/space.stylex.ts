import * as stylex from '@stylexjs/stylex';

/** A 4px grid, because the sheet-metal parts were on one too. */
export const space = stylex.defineVars({
  hairline: '1px',
  xxs: '2px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '22px',
  xl: '30px',
  xxl: '42px',
  xxxl: '60px',
  section: '84px',
  gutter: '24px',
});

/**
 * Radii stay small on purpose. Pressed steel and phenolic mouldings have a
 * tool radius of a millimetre or two, not a Tailwind `rounded-lg`.
 */
export const radius = stylex.defineVars({
  none: '0',
  tool: '2px',
  moulded: '4px',
  knob: '7px',
  lamp: '999px',
  bezel: '10px',
});

export const border = stylex.defineVars({
  hair: '1px',
  panel: '2px',
  frame: '3px',
  bezel: '5px',
});

export const measure = stylex.defineVars({
  /* the page's outer frame */
  page: '1240px',
  /* running prose, held near 62 characters */
  prose: '62ch',
  /* an 80-column listing at 12.6px Plex Mono */
  listing: '80ch',
  /* the printer's carriage */
  carriage: '34ch',
});

export const motion = stylex.defineVars({
  /* solenoids and relays: fast, and they arrive with a stop */
  relay: '90ms cubic-bezier(0.2, 0.9, 0.3, 1)',
  key: '130ms cubic-bezier(0.3, 0.8, 0.4, 1)',
  carriage: '260ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  lamp: '70ms linear',
});

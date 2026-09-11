/**
 * The deck. Twelve 80-column cards, punched in three fields:
 *   cols  1-10  name
 *   cols 11-18  department
 *   cols 19-24  amount, implied two decimals
 *
 * Amounts are integer cents, as every machine on this page held them.
 * The staff are the people whose paradigms appear in the exhibits.
 */

export const DEPTS = ['ASSEMBLY', 'PAYROLL', 'SHIPPING', 'TOOLROOM'] as const;
export type Dept = (typeof DEPTS)[number];

export type Card = {
  readonly name: string;
  readonly initial: string;
  readonly dept: number;
  readonly cents: number;
};

/** Presorted on the department field, as the 082 sorter would have left it. */
export const DECK: readonly Card[] = [
  { name: 'BACKUS', initial: 'J', dept: 0, cents: 12675 },
  { name: 'IVERSON', initial: 'K', dept: 0, cents: 10930 },
  { name: 'ROSSUM', initial: 'G', dept: 0, cents: 8815 },
  { name: 'CODD', initial: 'E', dept: 1, cents: 9760 },
  { name: 'HOLLERITH', initial: 'H', dept: 1, cents: 11840 },
  { name: 'HOPPER', initial: 'G', dept: 1, cents: 13425 },
  { name: 'AHO', initial: 'A', dept: 2, cents: 10420 },
  { name: 'KAY', initial: 'A', dept: 2, cents: 9985 },
  { name: 'KERNIGHAN', initial: 'B', dept: 2, cents: 11195 },
  { name: 'WEINBERGER', initial: 'P', dept: 2, cents: 9370 },
  { name: 'KOWALSKI', initial: 'R', dept: 3, cents: 11550 },
  { name: 'MOORE', initial: 'C', dept: 3, cents: 14200 },
];

export const money = (cents: number): string => (cents / 100).toFixed(2);
export const pad = (s: string | number, n: number): string => String(s).padEnd(n);
export const rpad = (s: string | number, n: number): string => String(s).padStart(n);

export const TOTALS: readonly number[] = DEPTS.map((_, i) =>
  DECK.filter((c) => c.dept === i).reduce((a, c) => a + c.cents, 0),
);

export const GRAND = TOTALS.reduce((a, b) => a + b, 0);

/** One report line, formatted for a 132-column 1403 at 14 + 9. */
export const line = (label: string, cents: number): string =>
  pad(label, 14) + rpad(money(cents), 9);

/**
 * Hollerith punches for a character, as an IBM 029 keypunch would cut them.
 * Row 12 and 11 are the two "zone" rows above the printed 0-9 digit rows.
 */
const ZONE: Record<string, number> = { 12: 12, 11: 11 };
export const HOLLERITH_ROWS = [12, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function punchesFor(ch: string): number[] {
  const c = ch.toUpperCase();
  if (c === ' ') return [];
  if (c >= '0' && c <= '9') return [Number(c)];
  if (c >= 'A' && c <= 'I') return [ZONE[12], c.charCodeAt(0) - 64];
  if (c >= 'J' && c <= 'R') return [ZONE[11], c.charCodeAt(0) - 73];
  if (c >= 'S' && c <= 'Z') return [0, c.charCodeAt(0) - 81];
  if (c === '.') return [12, 3, 8];
  if (c === ',') return [0, 3, 8];
  if (c === '-') return [11];
  return [];
}

/** The 24 punched columns of one card, as an array of row-lists. */
export function cardColumns(card: Card): number[][] {
  const text =
    pad(card.name, 10).slice(0, 10) +
    pad(DEPTS[card.dept], 8).slice(0, 8) +
    rpad(String(card.cents), 6).slice(0, 6);
  return Array.from(text).map(punchesFor);
}

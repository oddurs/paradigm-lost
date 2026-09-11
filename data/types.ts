/** A line the printer struck. `grand` marks the emphasised total line. */
export type PrintLine = string | { grand: string };

/**
 * What each exhibit's panel shows between the source and the report. One
 * variant per execution model, because that difference is the whole point of
 * the site: these machines do not merely spell the same algorithm differently,
 * they hold different things in their hands while they work.
 */
export type ViewState =
  /** wired control panel: which cords are carrying an impulse */
  | { kind: 'board'; live: number[]; card: number | null }
  /** named accumulators, the imperative control-break shape */
  | { kind: 'slots'; slots: [string, string][]; hot: number[]; card: number | null }
  /** an associative structure filling up */
  | { kind: 'table'; rows: [string, string][]; hot: number; card: number | null }
  /** the data stack, top at the bottom */
  | { kind: 'stack'; stack: string[]; vars: [string, string][] }
  /** APL's boolean membership matrix, built column by column */
  | { kind: 'matrix'; built: number; row: number; note: string }
  /** a resolution goal list with bindings */
  | { kind: 'goals'; lines: { t: string; cls?: 'now' | 'done' }[] }
  /** the RPG program cycle, five phases, one of them yours */
  | { kind: 'cycle'; phase: number; slots: [string, string][]; card: number | null };

export type Step = {
  /** what just happened, in the machine's own vocabulary */
  say: string;
  /** a line struck on the printer at this step, if any */
  print?: PrintLine | null;
  st: ViewState;
};

export type Cost = { kind: 'free' | 'costly'; text: string };

export type Exhibit = {
  id: string;
  year: string;
  nav: string;
  title: string;
  who: string;
  claim: string;
  /** does the listing genuinely execute in the panel below it? */
  executes: boolean;
  lang: string;
  code: string;
  notes: string[];
  costs: Cost[];
  trace: () => Step[];
};

@AGENTS.md

# Paradigm Lost

An interactive essay. One problem — *total the amounts by department and print a
report* — solved eleven ways between 1935 and 2026, with each paradigm's
**execution model** animated in a console beneath its listing.

## The argument (do not dilute it)

We did not progress from imperative to declarative. We **started** declarative,
because the earliest machines were configured rather than instructed; then spent
forty years writing the sort and the control break out longhand; then got the
idea back and named it `GROUP BY`. Exhibit 1 (an IBM 407 control panel) and
exhibit 8 (four lines of SQL) express the same four thoughts.

Every exhibit exists to advance that argument. If a change makes the page a
prettier Rosetta Code — syntax side by side, no execution models — it has
removed the only reason the page exists. **The traces are the content.**

## Commands

```bash
npm run dev        # http://localhost:1401   (port is the IBM 1401)
npm run check      # typecheck + build + verify — run this before pushing
npm run verify     # layout + Forth checks against ./out (needs a build first)
```

`npm run build` produces a static export in `out/`. Set `NEXT_PUBLIC_BASE_PATH`
for a subpath deploy; CI sets it to `/<repo>` for GitHub Pages.

## Toolchain gotchas

These cost real time to rediscover.

- **StyleX runs through the SWC compiler, not Babel.** The official
  `@stylexjs/nextjs-plugin` is stuck at 0.11 and requires Babel, which disables
  Turbopack. We use `@stylexswc/nextjs-plugin` + `@stylexswc/postcss-plugin`;
  Turbopack cannot run webpack plugins, so CSS **extraction lives in PostCSS**.
- **Alias config must be duplicated.** `aliases` and
  `unstable_moduleResolution.rootDir` are needed in *both* `next.config.ts` and
  `postcss.config.js`, or `@/design/...` imports fail to resolve at compile time
  with a misleading "theme file" error.
- **Token files must end in `.stylex.ts`.** `defineVars` in any other filename
  fails to compile.
- **After editing a `.stylex.ts` file, restart `next dev` with the cache cleared**
  (`rm -rf .next && npm run dev`). Turbopack's incremental cache and the PostCSS
  extraction step can fall out of step, and the page then renders with the
  affected custom properties simply *undefined* — which is quiet and misleading,
  because `background-color` falls back to transparent and `border-color` falls
  back to `currentColor`, so a panel looks unstyled rather than broken. Verify
  anything surprising against `npm run build` before believing it.
- **`stylex.props()` takes created styles only.** No inline object literals —
  add a named style to the `stylex.create` block instead.
- **Never mix a shorthand with its longhands** in one style object (`border`
  next to `borderColor`). Use longhands throughout.
- **Grid tracks: always `minmax(0, 1fr)`, never `1fr`.** Bare `1fr` means
  `minmax(auto, 1fr)`, so a wide code listing stretches its track and pushes the
  whole document sideways. `npm run verify` catches this.
- StyleX vars are plain `var(--x)` strings at runtime, so they can be used
  directly in SVG attributes: `fill={color.cardHole}`.
- For CSS that needs descendant selectors (`app/prose.css`), set custom
  properties via StyleX on the container and read them in the stylesheet. That
  keeps the rules theme-aware without hardcoding colours.

## Design system

Everything lives in `design/`. **Never write a colour, size, or spacing literal
in a component** — add a token.

| File | Exports |
| --- | --- |
| `tokens.stylex.ts` | `color`, `depth` (bevels), `texture` (surface grain) |
| `type.stylex.ts` | `font`, `size`, `leading`, `tracking`, `weight`, `optical` |
| `space.stylex.ts` | `space`, `radius`, `border`, `measure`, `motion` |

Light and dark values sit side by side on each token, so theming is
`prefers-color-scheme` with no runtime and no flash. Add both when adding a token.

Four rules hold the look together:

1. **Materials encode meaning, and never cross over.** Paper is what a human
   wrote (listings, prose). Machine green is the machine. Phosphor on glass is
   the machine's own view of its state. Greenbar is what it printed. The
   plugboard is a physical panel, so it is *not* rendered on a CRT.
2. **One light source, upper-left.** Every `depth` token assumes it. A new part
   that lights from elsewhere will look wrong next to everything else.
3. **Three type voices that never trade jobs.** Newsreader (one serif at two
   optical sizes) for prose; Saira Condensed, uppercase and letterspaced, *only*
   for lettering stamped on a machine plate; IBM Plex Mono for anything the
   machine said.
4. **Small radii.** Pressed steel and phenolic mouldings have a tool radius of a
   millimetre or two. No `rounded-lg` anywhere.
5. **Nothing is a flat fill.** Every surface takes a `texture` token, and every
   part that is a separate piece of hardware reads as one: a `Seam` between
   panels, a `RivetRow` along an edge, a countersink under a `Screw`. A part
   drawn as a plain rectangle will look pasted on.

Parts that are pressed out of sheet (`Vent`, `RivetRow`, `Seam`) must set
`display: block` — they render as `<span>`, and collapse to nothing when they
are not a flex item.

## The honesty rule

The **Forth exhibit genuinely executes** (`engines/forth.ts` — a token-threaded
interpreter). The other ten replay a hand-built trace of period-accurate source.
Every listing carries a badge saying which, and the colophon repeats it.

Never label a traced exhibit as executing. `npm run verify` diffs the Forth
output against the known totals precisely so that badge cannot quietly become a
lie.

## Adding an exhibit

1. Add a trace builder to `data/traces.ts`, or reuse `breakTrace` / `groupTrace`.
2. If it needs a new visualisation, add a variant to `ViewState` in
   `data/types.ts` and a `case` to `StateView` in `components/views/StateViews.tsx`.
3. Add the entry to `EXHIBITS` in `data/exhibits.ts` — listing, prose, and a
   two-line `costs` ledger (what the paradigm made free, what it made costly).
4. Keep chronological order. The page reads top to bottom as an argument.

## Voice

British spelling (*behaviour*, *colour*, *artefact*). Concrete over abstract.
Period terms of art used correctly and unglossed where the surrounding sentence
carries them — *control break*, *minor total*, *L1 indicator*, *pictured numeric
output*. No nostalgia, no "back in the day": the claim is that these machines
were *different*, not that they were better.

Historical accuracy outranks everything except not lying about what executes.
Cite sources in the colophon.

## Git workflow

- Branch off `main`; never commit to `main` directly.
- Run `npm run check` before pushing — CI runs exactly that.
- Commit subjects in the imperative mood, lower case, no trailing period
  (`fix grid tracks stretching on narrow viewports`).
- CI (typecheck, build, layout + Forth verification) must be green to merge.
  Merging to `main` deploys to GitHub Pages automatically.
- `AGENTS.md` is regenerated by `next dev` — leave its marked block alone and
  commit any changes it makes rather than reverting them.

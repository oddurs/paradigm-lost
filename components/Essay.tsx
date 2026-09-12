import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { border, measure, radius, space } from '@/design/space.stylex';
import { font, leading, size, tracking, weight } from '@/design/type.stylex';
import { Wrap } from '@/components/primitives/Layout';
import { Sheet } from '@/components/primitives/Surfaces';
import { DataPlate, Plate, Rule, Screw, Seam } from '@/components/primitives/Parts';

const s = stylex.create({
  band: { paddingBlock: space.section },

  /* ---- the rhyme: an equivalence placard bolted to the machine ---- */
  placard: {
    position: 'relative',
    maxWidth: '880px',
    backgroundColor: color.paper,
    backgroundImage: texture.paper,
    borderRadius: radius.tool,
    borderWidth: border.frame,
    borderStyle: 'solid',
    borderColor: color.marker,
    boxShadow: depth.cabinet,
    padding: { default: space.xl, '@media (max-width: 480px)': space.base },
  },
  placardHead: { marginBottom: space.base },
  para: {
    fontSize: size.base,
    lineHeight: leading.body,
    color: color.inkSoft,
    maxWidth: measure.prose,
    marginBottom: space.md,
  },
  strong: { color: color.ink, fontWeight: weight.semi },
  paraTop: { marginTop: space.lg },

  pair: {
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1fr) 40px minmax(0, 1fr)', '@media (max-width: 640px)': 'minmax(0, 1fr)' },
    gap: space.sm,
    alignItems: 'center',
    marginBlock: space.lg,
    maxWidth: '640px',
  },
  side: {
    fontFamily: font.mono,
    fontSize: size.sm,
    lineHeight: leading.snug,
    backgroundColor: color.paperLo,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.paperEdge,
    borderRadius: radius.tool,
    paddingBlock: space.md,
    paddingInline: space.base,
    color: color.ink,
  },
  eq: {
    textAlign: 'center',
    fontFamily: font.display,
    fontSize: size.xl,
    color: color.marker,
    lineHeight: leading.flush,
  },
  sideLabel: {
    display: 'block',
    fontFamily: font.plate,
    fontSize: size.micro,
    letterSpacing: tracking.plate,
    textTransform: 'uppercase',
    color: color.inkFaint,
    marginBottom: space.sm,
  },

  /* ---- closing essay ---- */
  closeSheet: { maxWidth: '900px' },
  h2: {
    fontFamily: font.display,
    fontSize: size.title,
    fontVariationSettings: '"opsz" 44',
    fontWeight: weight.semi,
    letterSpacing: tracking.display,
    lineHeight: leading.tight,
    textWrap: 'balance',
    maxWidth: '20ch',
    marginBottom: space.lg,
    color: color.ink,
    textShadow: depth.letterpress,
  },
  kicker: {
    marginTop: space.xl,
    paddingLeft: space.lg,
    borderLeftWidth: '2px',
    borderLeftStyle: 'solid',
    borderLeftColor: color.marker,
    fontFamily: font.display,
    fontStyle: 'italic',
    fontSize: size.lg,
    fontVariationSettings: '"opsz" 26',
    lineHeight: leading.snug,
    color: color.ink,
    maxWidth: '50ch',
  },

  /* ---- colophon ---- */
  foot: {
    borderTopWidth: border.frame,
    borderTopStyle: 'solid',
    borderTopColor: color.machineEdge,
    backgroundColor: color.machineDeep,
    paddingBlock: space.xl,
  },
  footGrid: {
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 2fr) minmax(0, 1fr)', '@media (max-width: 760px)': 'minmax(0, 1fr)' },
    gap: space.xl,
    alignItems: 'start',
  },
  footText: {
    fontFamily: font.mono,
    fontSize: size.xs,
    lineHeight: leading.loose,
    color: color.inkOnMachine,
    opacity: 0.6,
    maxWidth: '70ch',
  },
  footStrong: { opacity: 1, color: color.lampAmber },
  footPlate: { marginTop: space.xl, display: 'flex' },
});

export function Rhyme() {
  return (
    <section id="rhyme">
      <Seam riveted />
      <Wrap style={s.band}>
      <div {...stylex.props(s.placard)}>
        <Screw at="tl" i={0} />
        <Screw at="tr" i={2} />
        <Screw at="bl" i={3} />
        <Screw at="br" i={1} />

        <div {...stylex.props(s.placardHead)}>
          <Plate on="paper" s="sm" marker>
            The rhyme
          </Plate>
        </div>
        <Rule />

        <p {...stylex.props(s.para, s.paraTop)}>
          Put the first exhibit next to the eighth. In 1935 you sorted the deck on an 082, then
          wired a comparing exit to a counter’s total exit so that a change in the department field
          would print a subtotal and clear the counter. In 1974 you wrote four lines.
        </p>

        <div {...stylex.props(s.pair)}>
          <div {...stylex.props(s.side)}>
            <span {...stylex.props(s.sideLabel)}>1935 · wired</span>
            082 sorter pass
            <br />
            compare DEPT ≠ DEPT
            <br />
            counter 4A total exit
            <br />
            counter 4A reset
          </div>
          <div {...stylex.props(s.eq)}>≡</div>
          <div {...stylex.props(s.side)}>
            <span {...stylex.props(s.sideLabel)}>1974 · named</span>
            ORDER BY dept
            <br />
            GROUP BY dept
            <br />
            SUM(amount)
            <br />
            —
          </div>
        </div>

        <p {...stylex.props(s.para)}>
          These are the same four thoughts. The accounting machine expressed them as topology and
          the database expressed them as a name, and in both cases{' '}
          <span {...stylex.props(s.strong)}>the programmer never writes the loop</span>. The loop is
          the machine’s business.
        </p>
        <p {...stylex.props(s.para)}>
          Everything between them — FORTRAN, COBOL, the whole imperative middle — is people writing
          the sort and the break out longhand, because the machines of that era had learned to be
          general and forgotten how to be specific.
        </p>
        </div>
      </Wrap>
    </section>
  );
}

export function Closing() {
  return (
    <section id="closing">
      <Seam riveted />
      <Wrap style={s.band}>
      <Sheet style={s.closeSheet}>
        <h2 {...stylex.props(s.h2)}>We did not go from imperative to declarative</h2>

        <p {...stylex.props(s.para)}>
          The usual story is a ladder: machine code, then assembly, then procedures, then objects,
          then at long last the declarative styles, each rung an improvement on the last. Read this
          page from the top and that story falls apart.
        </p>
        <p {...stylex.props(s.para)}>
          We <i>started</i> declarative. We had to — the earliest machines were not machines you
          instructed, they were machines you <i>configured</i>, and a configuration has no time in
          it. A plugboard says what is true of every card. So does GROUP BY. So does an awk pattern,
          a Prolog clause, an APL matrix product.
        </p>
        <p {...stylex.props(s.para)}>
          Then the stored-program computer arrived and made everything possible, which meant it made
          nothing easy. For forty years the price of generality was that you wrote the loop, the
          comparison, the accumulator and the reset yourself, on every job, forever, and called the
          ones you got wrong bugs.
        </p>
        <p {...stylex.props(s.para)}>
          What SQL and awk and pandas recovered was not a new idea. It was the accounting machine’s
          idea, rebuilt on top of a general computer instead of underneath one —{' '}
          <span {...stylex.props(s.strong)}>specificity bought back at the cost of an interpreter</span>.
        </p>

        <p {...stylex.props(s.kicker)}>
          The control break was never lost, exactly. It was just, for a while, something you had to
          remember to do.
        </p>
        </Sheet>
      </Wrap>
    </section>
  );
}

export function Colophon() {
  return (
    <footer {...stylex.props(s.foot)}>
      <Wrap>
        <div {...stylex.props(s.footGrid)}>
          <p {...stylex.props(s.footText)}>
            <span {...stylex.props(s.footStrong)}>Sources. </span>
            IBM 407 Accounting Machine, Manual of Operation (A24-1011) · IBM 650 Manual of Operation
            (22-6060) · RPG II Reference (SC21-7504) · Backus et al., <i>The FORTRAN Automatic
            Coding System</i>, 1957 · Iverson, <i>A Programming Language</i>, 1962 · Codd,{' '}
            <i>A Relational Model of Data for Large Shared Data Banks</i>, 1970 · Chamberlin and
            Boyce, <i>SEQUEL</i>, 1974 · Aho, Weinberger and Kernighan, <i>Awk</i>, 1978 · Goldberg
            and Robson, <i>Smalltalk-80: The Language and its Implementation</i>, 1983.
          </p>
          <p {...stylex.props(s.footText)}>
            The Forth exhibit executes a small token-threaded interpreter written for this page. The
            other ten replay a hand-built trace of period-accurate source; each listing says which it
            is.
            <br />
            <br />
            Corrections welcome, especially from anyone who ran the real thing.
          </p>
        </div>

        <div {...stylex.props(s.footPlate)}>
          <DataPlate
            lines={[
              'Paradigm Lost · model 1935—2026',
              'ser. no. 1401-0011 · 11 exhibits · 1 interpreter',
              'total by department · deck presorted on cols 11-18',
            ]}
          />
        </div>
      </Wrap>
    </footer>
  );
}

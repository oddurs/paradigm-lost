import { runForth, FORTH_SOURCE } from '@/engines/forth';
import { boardTrace, breakTrace, cycleTrace, goalsTrace, groupTrace, matrixTrace } from '@/data/traces';
import type { Exhibit } from '@/data/types';

export const EXHIBITS: Exhibit[] = [
  {
    id: 'plugboard',
    year: '1935',
    nav: '407',
    title: 'There is no program',
    who: 'IBM 407 Accounting Machine · IBM 082 Sorter · no stored instruction of any kind',
    claim:
      'A program is a shape you wire into a panel. It has no first step, because it happens to every card at once.',
    executes: false,
    lang: 'Control panel wiring list',
    code: `*  407 CONTROL PANEL — MINOR TOTALS ON DEPT
*  DECK MUST FIRST PASS THE 082 SORTER ON COLS 11-18

   FROM                        TO
   READ EXIT   1-10   NAME  -> PRINT ENTRY  1-10
   READ EXIT  11-18   DEPT  -> PRINT ENTRY 20-27
   READ EXIT  11-18   DEPT  -> COMPARING ENTRY B
   READ EXIT  19-24   AMT   -> COUNTER 4A ADD
   COMPARING EXIT  UNEQUAL  -> PROGRAM START (MINOR)
   COUNTER 4A TOTAL EXIT    -> PRINT ENTRY 30-38
   COUNTER 4A TOTAL EXIT    -> COUNTER 4A RESET`,
    notes: [
      'There is no source listing for this exhibit because there is no source. The behaviour of the machine <b>is</b> the set of wires in the panel, and to change the report you unplug a cord and plug it somewhere else. A 407 program was a physical object you carried to the machine room in a frame.',
      'The whole report hangs on one cord: <code>COMPARING EXIT UNEQUAL</code> to <code>PROGRAM START</code>. The 407 compares each card’s department field against the one before it, and when they differ it fires a <i>control break</i> — take the counter’s accumulated total, print it, clear the counter, resume.',
      'That comparison only works because the deck arrived sorted, and the sort is not part of the program at all. It happened on a different machine, in a different room, possibly on a different day. <b>The precondition lives in the world rather than in the code</b>, which is the single most alien thing about this exhibit.',
    ],
    costs: [
      { kind: 'free', text: 'No loop, no counter management, no iteration variable. The card feed is the loop, and it is made of metal.' },
      { kind: 'costly', text: 'Anything that is not a break on a sorted field. Two independent groupings means two passes and two wirings.' },
    ],
    trace: boardTrace,
  },

  {
    id: 'fortran',
    year: '1957',
    nav: 'FORTRAN',
    title: 'Write the break out longhand',
    who: 'FORTRAN II on the IBM 704 · fixed form, columns 7–72 · John Backus and team',
    claim: 'A program is a sequence of statements with numbers on them, and the numbers are where you go.',
    executes: false,
    lang: 'FORTRAN II',
    code: `C     TOTAL BY DEPARTMENT
C     CARDS PRESORTED ON DEPT CODE, COLS 11-12
      SUM   = 0.0
      GRAND = 0.0
      LAST  = 0
      DO 40 J = 1, 12
      READ 100, N1, N2, KODE, AMT
      IF (LAST) 10, 10, 20
   10 LAST = KODE
   20 IF (KODE - LAST) 30, 35, 30
   30 PRINT 200, LAST, SUM
      GRAND = GRAND + SUM
      SUM   = 0.0
      LAST  = KODE
   35 SUM = SUM + AMT
   40 CONTINUE
      PRINT 200, LAST, SUM
      GRAND = GRAND + SUM
      PRINT 300, GRAND
      STOP
  100 FORMAT (2A4, I2, F7.2)
  200 FORMAT (1H , A8, F9.2)
  300 FORMAT (1H0, 11HGRAND TOTAL, F9.2)
      END`,
    notes: [
      'Everything the 407 did structurally, FORTRAN makes you say. The comparison, the print, the reset, the resume — four cords become nine statements, and the statement numbers are the only thing holding them together.',
      '<code>IF (KODE - LAST) 30, 35, 30</code> is the arithmetic IF: evaluate the expression, then branch to one of three labels depending on whether it came out negative, zero or positive. It is a three-way GOTO, and it was the primary conditional in the language.',
      'Note that the department is an integer code rather than a name. FORTRAN II had no character type; text existed only as Hollerith constants inside FORMAT statements, which is why the literal <code>11HGRAND TOTAL</code> has to carry its own length as a prefix. <b>The data had to be numbered before it could be processed</b>, and somebody in the building kept the codebook.',
      'And there at the bottom: the duplicated <code>PRINT 200</code> after the loop. The last department has no successor to differ from, so its total never breaks. Every control-break program written between 1957 and roughly 1985 contains this same small act of remembering, and the ones that forgot silently dropped a department.',
    ],
    costs: [
      { kind: 'free', text: 'Arithmetic, arrays, a loop you can nest. Genuinely general for the first time in history.' },
      { kind: 'costly', text: 'Text of any kind. And the thing the 407 did for free is now yours to get right, once per program, forever.' },
    ],
    trace: () => breakTrace({ prev: 'LAST', sum: 'SUM', grand: 'GRAND' }),
  },

  {
    id: 'cobol',
    year: '1960',
    nav: 'COBOL',
    title: 'The report is a data declaration',
    who: 'COBOL-60 · the CODASYL committee · Grace Hopper’s FLOW-MATIC as the direct ancestor',
    claim: 'A program is a description of records, and then some sentences about them.',
    executes: false,
    lang: 'COBOL',
    code: `       DATA DIVISION.
       FILE SECTION.
       FD  PAY-FILE  LABEL RECORDS ARE OMITTED.
       01  PAY-CARD.
           05  PC-NAME      PIC X(10).
           05  PC-DEPT      PIC X(8).
           05  PC-AMOUNT    PIC 9(4)V99.
       WORKING-STORAGE SECTION.
       77  WS-PREV-DEPT     PIC X(8)     VALUE SPACES.
       77  WS-DEPT-TOTAL    PIC 9(6)V99  VALUE ZERO.
       77  WS-GRAND-TOTAL   PIC 9(7)V99  VALUE ZERO.
       01  RPT-LINE.
           05  RL-DEPT      PIC X(14).
           05  RL-TOTAL     PIC ZZZ,ZZ9.99.

       PROCEDURE DIVISION.
       MAIN-LINE.
           PERFORM READ-A-CARD.
           PERFORM PROCESS-CARD UNTIL END-OF-FILE.
           PERFORM PRINT-BREAK.
           MOVE 'GRAND TOTAL' TO RL-DEPT.
           MOVE WS-GRAND-TOTAL TO RL-TOTAL.
           WRITE RPT-LINE AFTER ADVANCING 2 LINES.
           STOP RUN.

       PROCESS-CARD.
           IF PC-DEPT NOT = WS-PREV-DEPT
               AND WS-PREV-DEPT NOT = SPACES
               PERFORM PRINT-BREAK.
           MOVE PC-DEPT TO WS-PREV-DEPT.
           ADD PC-AMOUNT TO WS-DEPT-TOTAL.
           PERFORM READ-A-CARD.

       PRINT-BREAK.
           MOVE WS-PREV-DEPT TO RL-DEPT.
           MOVE WS-DEPT-TOTAL TO RL-TOTAL.
           WRITE RPT-LINE.
           ADD WS-DEPT-TOTAL TO WS-GRAND-TOTAL.
           MOVE ZERO TO WS-DEPT-TOTAL.`,
    notes: [
      'The control break is identical to FORTRAN’s — same comparison, same reset, same forgotten-final-group trap. What COBOL adds is somewhere to <i>put</i> the layout.',
      '<code>PIC ZZZ,ZZ9.99</code> is an edited picture, and it is the most underrated idea in the language: it declares that this field, when something is moved into it, will suppress leading zeros, insert a comma at the thousands and fix two decimals. The formatting is <b>a property of the destination, not an act of the code</b>. Modern printf is a step backwards from this.',
      'COBOL is mocked for its verbosity, but look at what the verbosity buys. A person who does payroll and not programming can read <code>ADD PC-AMOUNT TO WS-DEPT-TOTAL</code> and audit it. That was the explicit design goal, and by that measure it worked for sixty years.',
    ],
    costs: [
      { kind: 'free', text: 'Record layout, decimal arithmetic that is actually decimal, and report formatting as declaration.' },
      { kind: 'costly', text: 'Still writing the break by hand. And the DATA DIVISION is where the program’s real complexity goes to hide.' },
    ],
    trace: () => breakTrace({ prev: 'WS-PREV-DEPT', sum: 'WS-DEPT-TOTAL', grand: 'WS-GRAND-TOTAL' }),
  },

  {
    id: 'rpg',
    year: '1964',
    nav: 'RPG',
    title: 'The loop you are not allowed to write',
    who: 'RPG II · IBM System/360 Model 20 · a deliberate descendant of the 407 panel',
    claim: 'A program is a set of specifications, and the machine supplies the control flow.',
    executes: false,
    lang: 'RPG II specification sheets',
    code: `     H*  TOTAL BY DEPARTMENT                       RPG II
     FPAYCARD IP  F      24            READ01  SYSIPT
     FREPORT  O   F      80            PRINTER
    *
    *  I-SPEC: FIELD DESCRIPTIONS. THE "L1" IS THE WHOLE TRICK.
     IPAYCARD AA  01
     I                          1   10 NAME
     I                         11   18 DEPT      L1
     I                         19   24 2AMT
    *
    *  C-SPEC: THE ONLY LINES YOU ACTUALLY WROTE
     C   01            AMT       ADD  DTOT      DTOT    72
     C   L1            DTOT      ADD  GTOT      GTOT    82
    *
    *  O-SPEC: WHAT PRINTS, AND ON WHICH INDICATOR
     OREPORT  T    L1
     O                DEPT             20
     O                DTOT   J         38
     OREPORT  T    LR
     O                'GRAND TOTAL'    20
     O                GTOT   J         38`,
    notes: [
      'Look for the loop. There is not one. RPG has a fixed <i>program cycle</i> built into the runtime: read a card, set indicators, do total-time output, run the calculation specs, do detail output, repeat until the hopper is empty. You do not write it and you cannot change it.',
      'The two characters <code>L1</code> in columns 59–60 of the input spec declare that <code>DEPT</code> is a control field at level one. From that single annotation the cycle derives everything — it saves the previous value, compares on every card, sets the <code>L1</code> indicator when it changes, and runs total-time output <i>before</i> the new card’s detail processing. <b>The control break has become a declaration again</b>, twenty-nine years after the 407.',
      '<code>LR</code> is last-record, set automatically at end of file, which means RPG cannot have FORTRAN’s dropped-final-group bug: the last break is not something a programmer is able to forget.',
      'The price is total. Your program has one shape, and programs that do not fit the cycle get written by fighting it; generations of RPG programmers have the scars. But for this problem — and this problem was most of commercial computing in 1964 — six lines do the work of COBOL’s forty.',
    ],
    costs: [
      { kind: 'free', text: 'The loop, the break, the previous-value save, the end-of-file total, and the report layout.' },
      { kind: 'costly', text: 'Literally anything with a different control shape. There is no escape hatch, only the cycle.' },
    ],
    trace: cycleTrace,
  },

  {
    id: 'apl',
    year: '1966',
    nav: 'APL',
    title: 'The grouping is a matrix',
    who: 'APL\\360 · Kenneth Iverson at IBM Research · notation from A Programming Language, 1962',
    claim: 'A program is an expression. Control structure dissolves into the shape of the data.',
    executes: false,
    lang: 'APL',
    code: `      ⍝  DEPT is a 12-row character matrix, AMT a 12-vector
      ⍝  U is the four distinct departments

      U ← ∪ DEPT

      T ← (U ∘.≡ DEPT) +.× AMT

      ⍝  and that is the program.
      ⍝  ∘.≡  builds a 4×12 boolean membership matrix
      ⍝  +.×  is the inner product: rows against amounts

      ⍝  the grand total, for completeness:
      +/T`,
    notes: [
      'The entire report is one line, and it contains no loop, no accumulator, no comparison against a previous value, and no dependence whatsoever on the order of the deck.',
      '<code>U ∘.≡ DEPT</code> is an outer product: take every department name against every card’s department and produce a matrix of ones and zeros. That matrix <i>is</i> the grouping — row two is a mask selecting the payroll cards. Watch it build in the panel below.',
      'Then <code>+.×</code>, the inner product, multiplies that matrix by the amount vector: exactly matrix multiplication, which means each row contributes an amount only where its mask is one. <b>Grouping and summing turn out to be the same operation as linear algebra</b>, and once you have seen that you cannot unsee it.',
      'This is a different claim from every exhibit above it. FORTRAN and COBOL and RPG all agree that a program is a sequence of things happening to one card at a time. APL says the whole deck is a single value, and the program is a function of it.',
    ],
    costs: [
      { kind: 'free', text: 'Order-independence, no loop, no break, no reset. The 4×12 intermediate is the algorithm made visible.' },
      { kind: 'costly', text: 'That intermediate is real: this materialises a matrix proportional to cards × groups. Fine for twelve cards, less fine for twelve million.' },
    ],
    trace: matrixTrace,
  },

  {
    id: 'forth',
    year: '1970',
    nav: 'Forth',
    title: 'The stack is the whole machine',
    who: 'Forth · Charles Moore · written to point radio telescopes, and then everything else',
    claim: 'A program is a vocabulary. You extend the language downward until the problem is a word in it.',
    executes: true,
    lang: 'Forth',
    code: FORTH_SOURCE,
    notes: [
      'This one genuinely executes. The panel below is a small token-threaded Forth running that exact source a word at a time, so you can watch the data stack fill and drain. Amounts are integer cents, because Forth of this era had no floating point and did not miss it.',
      'There are no parameters and no local variables anywhere. <code>RECORD</code> receives its arguments because <code>CARD</code> left them on the stack, and it juggles them with <code>SWAP</code> and <code>DUP</code>. This is either liberating or appalling depending on the hour of the day.',
      'The real idea is the colon. Every definition adds a word to the dictionary, and from that moment it is indistinguishable from a built-in — <code>BREAK</code> is now part of the language. <b>You do not write a program in Forth so much as grow a language down towards the problem</b>, which is why the top-level word is three lines long.',
      'The control break is back to being hand-written, as it was in FORTRAN. But notice where it lives now: it is a <i>named thing</i>, defined once, and the last line reads almost like the RPG spec sheet two exhibits up.',
    ],
    costs: [
      { kind: 'free', text: 'Extreme economy. This compiles to a few hundred bytes and needs no operating system underneath it.' },
      { kind: 'costly', text: 'Stack juggling is a real cognitive tax, and the compiler will not help you — there are no types for it to check.' },
    ],
    trace: runForth,
  },

  {
    id: 'prolog',
    year: '1972',
    nav: 'Prolog',
    title: 'Say what a total is, not how to get one',
    who: 'Prolog · Alain Colmerauer at Marseille · with Robert Kowalski’s procedural reading of logic',
    claim: 'A program is a set of true statements. Running it means asking a question.',
    executes: false,
    lang: 'Prolog',
    code: `%  the deck, as facts. amounts in cents.
pay(backus,     assembly, 12675).
pay(iverson,    assembly, 10930).
pay(rossum,     assembly,  8815).
pay(codd,       payroll,   9760).
pay(hollerith,  payroll,  11840).
pay(hopper,     payroll,  13425).
pay(aho,        shipping, 10420).
pay(kay,        shipping,  9985).
pay(kernighan,  shipping, 11195).
pay(weinberger, shipping,  9370).
pay(kowalski,   toolroom, 11550).
pay(moore,      toolroom, 14200).

%  a department total is the sum of the amounts in it.
total(Dept, Total) :-
    setof(D, N^A^pay(N, D, A), Depts),
    member(Dept, Depts),
    findall(A, pay(_, Dept, A), Amounts),
    sum_list(Amounts, Total).

%  the report is every solution to that.
?- forall(total(D, T), report_line(D, T)).`,
    notes: [
      'Nothing here describes a procedure. <code>total(Dept, Total)</code> is a claim about when two things stand in a relation, and the report is produced by asking for every pair that satisfies it. The engine does the searching.',
      '<code>findall(A, pay(_, Dept, A), Amounts)</code> reads: collect every <code>A</code> such that somebody in this department was paid it. The underscore is an anonymous variable — the name is irrelevant to the question, so it does not get one.',
      'Deck order is meaningless here, as it was for APL, but for a different reason. APL made order irrelevant by treating the deck as one value; Prolog makes it irrelevant by treating it as an unordered set of assertions. <b>Both had to abandon the card feed to get there.</b>',
      'And the same program answers questions it was never written for. <code>?- total(shipping, T).</code> asks about one department. <code>?- pay(N, D, A), A > 12000.</code> asks who earns most. There is no main. There is a database of truths, and whatever you care to ask of it.',
    ],
    costs: [
      { kind: 'free', text: 'Order, grouping, iteration, and every query you did not think of when you wrote it.' },
      { kind: 'costly', text: 'Knowing what it will cost to run. The search strategy is the implementation’s business, right up until it is suddenly yours.' },
    ],
    trace: goalsTrace,
  },

  {
    id: 'sql',
    year: '1974',
    nav: 'SQL',
    title: 'Name the thing the 407 was wired for',
    who: 'SEQUEL · Donald Chamberlin and Raymond Boyce at IBM San Jose · on Codd’s 1970 relational model',
    claim: 'A program is a description of the answer. Someone else decides how to get it.',
    executes: false,
    lang: 'SQL',
    code: `SELECT   dept,
         SUM(amount) AS total
FROM     payroll
GROUP BY dept
ORDER BY dept;`,
    notes: [
      'Four lines, and every one of them is a cord from the first exhibit. <code>ORDER BY</code> is the 082 sorter. <code>GROUP BY</code> is the comparing exit. <code>SUM</code> is counter 4A. The reset is so thoroughly implied that the language has no word for it.',
      'This is the hinge of the whole page. Thirty-nine years after the accounting machine, and after four exhibits of programmers writing the sort and the break and the reset out by hand, somebody wrote the four ideas down as <i>names</i> and the problem stopped being a program.',
      'What changed underneath is the interesting part. The 407 could only do this because a human had already sorted the deck; the query planner decides for itself whether to sort-and-break or build a hash table, and on a large enough table it picks the plugboard’s strategy for the plugboard’s reasons. <b>Sorting in order to group never stopped being the right answer — it stopped being the programmer’s problem.</b>',
      'Codd’s claim in 1970 was that data has a structure independent of how any particular program wants to walk it. Nothing on this page before this exhibit believed that. Everything after it assumes it.',
    ],
    costs: [
      { kind: 'free', text: 'The loop, the break, the sort, the reset, the parallelism, and the choice of algorithm.' },
      { kind: 'costly', text: 'Anything that is not a set operation. And you cannot see what it did — that is the trade you are making.' },
    ],
    trace: () =>
      groupTrace({
        open: 'Query parsed. The planner has chosen a hash aggregate — no sort needed, which the 407 could not have imagined.',
        mid: 'Scan complete. Four groups, twelve rows read exactly once. Now ORDER BY sorts the <i>result</i>, not the input.',
        close: 'Result set returned. Nothing you just watched was written by the person who asked the question.',
      }),
  },

  {
    id: 'awk',
    year: '1977',
    nav: 'awk',
    title: 'The program cycle, with a Unix accent',
    who: 'awk · Alfred Aho, Peter Weinberger and Brian Kernighan at Bell Labs',
    claim: 'A program is a set of rules: when you see this, do that. The reading is not your job.',
    executes: false,
    lang: 'awk',
    code: `{ total[$2] += $3 }

END { for (d in total)
        printf "%-14s%9.2f\\n", d, total[d]
      printf "%-14s%9.2f\\n", "GRAND TOTAL", sum }`,
    notes: [
      'Two rules. The first has no condition, so it runs on every line; the second runs at end of input. There is no loop in the source because awk supplies one — read a record, split it into fields, test each pattern, run the actions that match, repeat. Exactly as RPG did it in 1964.',
      '<code>total[$2] += $3</code> creates the bucket on first touch. Associative arrays were not a common language feature in 1977, and they are what let the grouping be one character of syntax instead of a data structure you have to build.',
      'Compare this with the RPG spec sheet three exhibits up. Both declare per-record behaviour and let the runtime own the sequence; both have an automatic end-of-input hook, called <code>END</code> here and <code>LR</code> there. <b>Two entirely separate traditions independently rediscovered the accounting machine’s shape</b>, one in commercial data processing and one inside a research phone company.',
      'And unlike every card-era exhibit, the deck order is irrelevant — because the hash table remembers what the control break had to be told.',
    ],
    costs: [
      { kind: 'free', text: 'The read loop, field splitting, the grouping structure, and the end-of-input hook. Two lines is the whole program.' },
      { kind: 'costly', text: 'Output order: a for-in loop over an awk array is unordered, so the version above is quietly cheating.' },
    ],
    trace: () =>
      groupTrace({
        open: 'awk supplies the main loop. The source contains no reference to reading, to splitting, or to looping at all.',
        mid: 'End of input, and the <b>END</b> rule fires — the same automatic end-of-file hook that RPG called LR.',
        close: 'Done. Twelve lines in, five lines out, two rules of source.',
      }),
  },

  {
    id: 'smalltalk',
    year: '1980',
    nav: 'Smalltalk',
    title: 'There is no file to run',
    who: 'Smalltalk-80 · Alan Kay, Dan Ingalls and Adele Goldberg at Xerox PARC',
    claim: 'A program is a live world of objects. You do not run it; you talk to it while it is already running.',
    executes: false,
    lang: 'Smalltalk-80',
    code: `| totals |
totals := deck
    inject: Dictionary new
    into: [:acc :card |
        acc at: card dept
            put: (acc at: card dept ifAbsent: [0]) + card amount.
        acc].

totals keys asSortedCollection do: [:d |
    Transcript show: (d paddedTo: 14);
               show: ((totals at: d) / 100) printString;
               cr].

"or, once you have taught the collection the idea:"

(deck groupedBy: [:card | card dept])
    collect: [:group | group inject: 0 into: [:a :c | a + c amount]]`,
    notes: [
      'You do not compile this. You select it inside a running image, press <i>do it</i>, and it happens to objects that were already alive — and that stay alive afterwards. The deck is not read from a file at the start of a run, because <b>there is no start of a run</b>.',
      '<code>[:acc :card | … ]</code> is a block: an object that holds code, which you hand to the collection so that it can call you back. Every conditional and every loop in the language is built from this and nothing else. <code>ifTrue:</code> is a message sent to a boolean with a block as its argument, and that is not a metaphor or a teaching simplification.',
      'The last stanza is the Smalltalk move. <code>groupedBy:</code> is not a language feature — it is a method somebody added to Collection one afternoon, inside the image, while the system was running, and from then on it was as native as anything Xerox shipped. This is the same instinct as Forth’s dictionary, ten years later and a great deal larger.',
      'The consequence nobody expects: an image can be saved with your half-finished work still on the stack, mailed to a colleague, and resumed mid-thought on their machine. The program and its execution are the same artefact.',
    ],
    costs: [
      { kind: 'free', text: 'Uniformity. There are no statements and no privileged types — grouping is a message like any other.' },
      { kind: 'costly', text: 'Version control, deployment, and explaining to anybody what the source of your program actually is.' },
    ],
    trace: () =>
      groupTrace({
        open: 'Expression selected in a workspace, <b>do it</b> pressed. The deck objects existed before you typed this.',
        mid: '<b>inject:into:</b> has finished. That Dictionary is a live object — you could inspect it right now, and it will still be there tomorrow.',
        close: 'Transcript written. The image is unchanged in every respect except that it now contains one more Dictionary.',
      }),
  },

  {
    id: 'pandas',
    year: '2026',
    nav: 'today',
    title: 'Everything, and nothing to see',
    who: 'pandas · and its ancestors, all of them, invisible',
    claim: 'A program is one line. What it does underneath is not a question you are expected to ask.',
    executes: false,
    lang: 'Python',
    code: `import pandas as pd

df = pd.read_fwf("payroll.txt",
                 colspecs=[(0,10),(10,18),(18,24)],
                 names=["name","dept","amount"])

print(df.groupby("dept")["amount"].sum())`,
    notes: [
      'One line does the work. It is a good line, it is the right line, and almost nobody who writes it could tell you what happens inside.',
      'What happens inside is a hash aggregate — and if the frame is large enough, or the operation spills to disk, what happens inside is <i>a sort followed by a control break</i>, because that is still, in 2026, the correct algorithm when the groups do not fit in memory. The 407 was not doing a primitive version of this. It was doing this.',
      'Look at <code>colspecs=[(0,10),(10,18),(18,24)]</code>. Those are the punched card’s column boundaries, and the function is called <code>read_fwf</code> — read fixed width formatted. Ninety years on, the deck is still a supported input format, and the columns have not moved.',
      'This is not a lament. Layers that hide their machinery are how anything large gets built, and nobody should have to wire a panel to add up a column of numbers. But it is worth knowing that the thing being hidden is not complexity for its own sake. It is a sorter, a comparator and a counter, and somebody wired them together before the war.',
    ],
    costs: [
      { kind: 'free', text: 'All of it. Reading, parsing, typing, grouping, summing, formatting, and the choice of algorithm.' },
      { kind: 'costly', text: 'Knowing what it did — which matters exactly when the data gets big enough to care, and not one moment before.' },
    ],
    trace: () =>
      groupTrace({
        open: 'read_fwf parses the fixed-width columns — the same 1–10, 11–18, 19–24 boundaries the 407 was wired for.',
        mid: 'groupby builds a hash from group keys to row positions. On a frame too large for memory this becomes sort-then-break, which is exhibit one.',
        close: 'Series returned. Total source: one line. Total lineage: this entire page.',
      }),
  },
];

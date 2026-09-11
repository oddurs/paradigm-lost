import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { border, radius, space } from '@/design/space.stylex';
import { font, leading, size, tracking } from '@/design/type.stylex';
import { Badge, Plate } from '@/components/primitives/Parts';

/* ------------------------------------------------------------------ *
 * Highlighting. Deliberately thin: a comment colour, a keyword colour,
 * and nothing else. These languages were read on paper in one ink.
 * ------------------------------------------------------------------ */

const KEYWORDS: Record<string, string[]> = {
  'FORTRAN II': ['DO', 'READ', 'PRINT', 'IF', 'FORMAT', 'STOP', 'END', 'CONTINUE'],
  COBOL: [
    'DATA', 'DIVISION', 'SECTION', 'FILE', 'WORKING-STORAGE', 'PROCEDURE', 'PERFORM',
    'MOVE', 'ADD', 'WRITE', 'IF', 'UNTIL', 'TO', 'STOP', 'RUN', 'PIC', 'VALUE', 'FD',
    'NOT', 'AND', 'AFTER', 'ADVANCING', 'LINES', 'LABEL', 'RECORDS', 'ARE', 'OMITTED',
    'SPACES', 'ZERO',
  ],
  Forth: ['VARIABLE', 'IF', 'THEN', 'ELSE', 'DO', 'LOOP', 'DUP', 'DROP', 'SWAP', 'CR'],
  Prolog: ['setof', 'findall', 'member', 'sum_list', 'forall'],
  SQL: ['SELECT', 'FROM', 'GROUP', 'BY', 'ORDER', 'SUM', 'AS'],
  awk: ['END', 'for', 'in', 'printf'],
  'Smalltalk-80': ['inject', 'into', 'collect', 'do', 'at', 'put', 'ifAbsent', 'show', 'cr'],
  Python: ['import', 'as', 'print', 'def', 'return'],
};

const COMMENT = /^(\s*)(C(?=\s)|\*|%|⍝|--|#|\\|\/\/|")(.*)$/;

const s = stylex.create({
  frame: {
    position: 'relative',
    backgroundColor: color.paper,
    backgroundImage: texture.paper,
    borderRadius: radius.tool,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.paperEdge,
    boxShadow: depth.sheet,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
    paddingBlock: space.sm,
    paddingInline: space.md,
    borderBottomWidth: border.hair,
    borderBottomStyle: 'dashed',
    borderBottomColor: color.paperEdge,
    backgroundColor: color.paperLo,
  },
  scroll: {
    overflowX: 'auto',
    paddingBlock: space.base,
    paddingInline: space.md,
    /* the faint blue ruling of a coding form */
    backgroundImage: `repeating-linear-gradient(180deg,
      transparent 0 26px,
      rgba(35,76,115,0.045) 26px 27px)`,
  },
  pre: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: '12.6px',
    lineHeight: leading.printer,
    color: color.ink,
    tabSize: 4,
    whiteSpace: 'pre',
  },
  comment: { color: color.inkFaint, fontStyle: 'italic' },
  keyword: { color: color.marker, fontWeight: 500 },
  /* the red column-marker rule down a FORTRAN coding form at col 7 */
  margin: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '1px',
    backgroundColor: color.marker,
    opacity: 0.22,
    pointerEvents: 'none',
  },
});

function Line({ text, keywords }: { text: string; keywords: string[] }) {
  const m = text.match(COMMENT);
  if (m) {
    return <span {...stylex.props(s.comment)}>{text}</span>;
  }
  if (!keywords.length) return <>{text}</>;

  const re = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  const out: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    out.push(
      <span key={`${match.index}`} {...stylex.props(s.keyword)}>
        {match[0]}
      </span>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export function Listing({
  code,
  lang,
  executes,
}: {
  code: string;
  lang: string;
  executes: boolean;
}) {
  const keywords = KEYWORDS[lang] ?? [];
  const lines = code.split('\n');
  const fortranForm = lang === 'FORTRAN II';

  return (
    <div {...stylex.props(s.frame)}>
      <div {...stylex.props(s.head)}>
        <Plate on="paper" s="micro">
          {lang}
        </Plate>
        <Badge live={executes}>{executes ? 'executes here' : 'traced, not emulated'}</Badge>
      </div>

      <div {...stylex.props(s.scroll)}>
        {fortranForm && <span aria-hidden {...stylex.props(s.margin)} style={{ left: '5.6em' }} />}
        <pre {...stylex.props(s.pre)}>
          <code>
            {lines.map((ln, i) => (
              <span key={i}>
                <Line text={ln} keywords={keywords} />
                {i < lines.length - 1 ? '\n' : ''}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

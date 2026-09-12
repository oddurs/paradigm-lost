import type { Metadata, Viewport } from 'next';
import { Newsreader, Saira_Condensed, IBM_Plex_Mono } from 'next/font/google';
import * as stylex from '@stylexjs/stylex';
import { color, texture } from '@/design/tokens.stylex';
import { font, leading, size } from '@/design/type.stylex';
import './reset.css';
import './prose.css';
import './stylex.css';

/* Newsreader carries an optical-size axis, which is why this page needs
   only one serif: the display and the body text are the same family cut
   for different sizes, rather than two families pretending to agree. */
const display = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-display',
  display: 'swap',
});

/* The lettering stamped on a machine's name plate. */
const plate = Saira_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-plate',
  display: 'swap',
});

/* Anything the machine itself said. */
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddurs.github.io/paradigm-lost';
const DESCRIPTION =
  'One problem — total the amounts by department — solved eleven ways between 1935 and 2026, with the execution model of each one shown working.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Paradigm Lost',
  description: DESCRIPTION,
  applicationName: 'Paradigm Lost',
  authors: [{ name: 'Oddur Sigurdsson' }],
  keywords: [
    'history of computing', 'programming paradigms', 'punched cards', 'plugboard',
    'IBM 407', 'control break', 'APL', 'Forth', 'Prolog', 'COBOL', 'RPG', 'SQL',
  ],
  openGraph: {
    type: 'article',
    title: 'Paradigm Lost',
    description: DESCRIPTION,
    siteName: 'Paradigm Lost',
    url: SITE,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paradigm Lost',
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#5C7061' },
    { media: '(prefers-color-scheme: dark)', color: '#121814' },
  ],
};

const styles = stylex.create({
  body: {
    minHeight: '100dvh',
    backgroundColor: color.machine,
    /* the room light comes from above, so the cabinet is brighter at the top */
    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0) 22%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0.13)), ${texture.enamel}`,
    backgroundAttachment: 'fixed',
    color: color.ink,
    fontFamily: font.display,
    fontSize: size.base,
    lineHeight: leading.body,
    fontVariationSettings: '"opsz" 16',
    WebkitFontSmoothing: 'antialiased',
    textRendering: 'optimizeLegibility',
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${plate.variable} ${mono.variable}`}>
      <body {...stylex.props(styles.body)}>{children}</body>
    </html>
  );
}

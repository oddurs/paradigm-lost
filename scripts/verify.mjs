/**
 * Verification for the static export in ./out.
 *
 * Two things are checked, both of them regressions this project has actually
 * had rather than ceremony:
 *
 *   1. The page never scrolls sideways. Grid tracks written as `1fr` resolve to
 *      `minmax(auto, 1fr)`, so a wide code listing silently stretches its track
 *      and pushes the document out. This caught that, and it caught a
 *      `white-space: nowrap` on inline code doing the same thing.
 *
 *   2. The Forth exhibit is the one listing that claims to execute, so its
 *      printed report is compared against the known totals. If the interpreter
 *      in engines/forth.ts regresses, the badge on that listing becomes a lie.
 *
 * Usage: node scripts/verify.mjs   (after `npm run build` with no basePath)
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const ROOT = new URL('../out/', import.meta.url).pathname;
const PORT = 4173;
const WIDTHS = [320, 375, 414, 768, 1024, 1440];

const EXPECTED_REPORT = [
  'ASSEMBLY         324.20',
  'PAYROLL          350.25',
  'SHIPPING         409.70',
  'TOOLROOM         257.50',
  '',
  'GRAND TOTAL     1341.65',
].join('\n');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(ROOT)) {
  console.error('No ./out directory. Run `npm run build` first.');
  process.exit(1);
}

const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let path = join(ROOT, normalize(url).replace(/^(\.\.[/\\])+/, ''));
  if (url.endsWith('/')) path = join(path, 'index.html');
  else if (!extname(path)) path += '.html';
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

const failures = [];
const ok = (msg) => console.log(`  ok   ${msg}`);
const bad = (msg) => {
  console.log(`  FAIL ${msg}`);
  failures.push(msg);
};

await new Promise((r) => server.listen(PORT, r));
const browser = await chromium.launch();

try {
  console.log('\nhorizontal overflow');
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (over === 0) ok(`${width}px — no sideways scroll`);
    else bad(`${width}px — document overflows by ${over}px`);
    await ctx.close();
  }

  console.log('\nforth interpreter');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const forth = page.locator('#forth');
  await forth.scrollIntoViewIfNeeded();
  const step = forth.getByRole('button', { name: 'Step' });
  const counter = forth.locator('span', { hasText: /^\d{3} \/ \d{3}$/ }).last();
  const total = Number((await counter.innerText()).split('/')[1]);

  // drive it to the end by stepping, which is deterministic and far faster
  // than waiting out the Run tempo
  for (let i = 0; i < total; i++) {
    if (await step.isDisabled()) break;
    await step.click({ timeout: 5000 });
  }

  const printed = (await forth.locator('pre[aria-label="Printer output"]').innerText()).trim();
  if (printed === EXPECTED_REPORT) {
    ok('printed report matches the known totals');
  } else {
    bad('printed report does not match');
    console.log('\n--- expected ---\n' + EXPECTED_REPORT + '\n--- got ---\n' + printed + '\n');
  }
  await ctx.close();
} finally {
  await browser.close();
  server.close();
}

console.log('');
if (failures.length) {
  console.error(`${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('All checks passed.');

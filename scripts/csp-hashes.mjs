#!/usr/bin/env node
/**
 * Keeps the script-src hash list in _headers in sync with the inline <script>
 * blocks in the exported pages.
 *
 *   node scripts/csp-hashes.mjs          rewrite _headers
 *   node scripts/csp-hashes.mjs --check  exit 1 if _headers is out of date (CI)
 *
 * A CSP hash only matches if the script text is byte-for-byte the same, so any
 * edit to an inline script (or a re-export that changes one) needs this re-run.
 * No dependencies; Node 18+.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const SKIP_DIRS = new Set(['.git', '.github', 'node_modules', '.wrangler', 'workers', 'scripts']);
const HEADERS_FILE = '_headers';
const SCRIPT_SRC_RE = /script-src [^;]*;/;
// Hosts allowed to serve external scripts. Hashes are appended after these.
const SCRIPT_HOSTS = [
  "'self'",
  'https://www.googletagmanager.com',
  'https://www.google.com',
  'https://www.gstatic.com',
  // Staging loads WordPress script modules from the live domain; on prod this is 'self'.
  'https://a4i.iiitb.ac.in'
];
// Data blocks CSP does not apply to. NOT importmap or speculationrules: CSP
// checks those inline blocks too, so they are hashed like scripts.
const DATA_TYPE_RE = /type\s*=\s*["']?(application\/ld\+json|application\/json)/i;

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* htmlFiles(join(dir, entry.name));
    } else if (entry.name.endsWith('.html')) {
      yield join(dir, entry.name);
    }
  }
}

function collectHashes(root) {
  const hashes = new Map(); // hash -> { pages, preview }
  for (const file of htmlFiles(root)) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const [, attrs, body] = m;
      if (/\bsrc\s*=/i.test(attrs) || DATA_TYPE_RE.test(attrs) || !body.trim()) continue;
      // Normalise CRLF so a Windows checkout hashes the same as the Linux deploy.
      const text = body.replace(/\r\n/g, '\n');
      const hash = 'sha256-' + createHash('sha256').update(text, 'utf8').digest('base64');
      const entry = hashes.get(hash) || { pages: new Set(), preview: text.trim().slice(0, 60).replace(/\s+/g, ' ') };
      entry.pages.add(relative(root, file));
      hashes.set(hash, entry);
    }
  }
  return hashes;
}

const root = process.cwd();
const check = process.argv.includes('--check');
const hashes = collectHashes(root);
const directive = 'script-src ' + [...SCRIPT_HOSTS, ...[...hashes.keys()].sort().map((h) => `'${h}'`)].join(' ') + ';';

const current = readFileSync(HEADERS_FILE, 'utf8');
if (!SCRIPT_SRC_RE.test(current)) {
  console.error(`No script-src directive found in ${HEADERS_FILE}`);
  process.exit(2);
}
const eol = current.includes('\r\n') ? '\r\n' : '\n';
const next = current.replace(SCRIPT_SRC_RE, () => directive);

if (next === current) {
  console.log(`${HEADERS_FILE} is up to date (${hashes.size} inline script hashes).`);
} else if (check) {
  console.error(`${HEADERS_FILE} script-src is out of date (${hashes.size} inline script hashes expected).`);
  console.error('Run: node scripts/csp-hashes.mjs   and commit the result.');
  process.exit(1);
} else {
  writeFileSync(HEADERS_FILE, next.replace(/\r?\n/g, eol));
  console.log(`Updated ${HEADERS_FILE}: ${hashes.size} inline script hashes.`);
}

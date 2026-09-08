// Runs every tests/unit/*.test.js against the game logic extracted from src/game.js (no browser needed).
// Each test file is concatenated after the harness + game code and run in a fresh node process.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
let js = readFileSync(resolve(root, 'src/game.js'), 'utf8');
js = js.replace(/__ASSET__\('([^']+)'\)/g, "null").replace('__BUILD_STAMP__', 'test');
const a = js.indexOf("'use strict'"), b = js.lastIndexOf('\ninit();');
const game = js.slice(a, b);
const harness = readFileSync(resolve(root, 'tests/unit/harness.js'), 'utf8');
mkdirSync(resolve(root, '.tmp'), { recursive: true });
let failed = 0;
for (const f of readdirSync(resolve(root, 'tests/unit')).filter(x => x.endsWith('.test.js')).sort()) {
  const bundle = resolve(root, '.tmp', f.replace('.test.js', '.run.js'));
  writeFileSync(bundle, harness + '\n' + game + '\n' + readFileSync(resolve(root, 'tests/unit', f), 'utf8'));
  const r = spawnSync(process.execPath, [bundle], { encoding: 'utf8' });
  const last = (r.stdout.trim().split('\n').pop() || '') + (r.stderr ? ' ' + r.stderr.trim().split('\n')[0] : '');
  const ok = r.status === 0 && /0 failed/.test(r.stdout);
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${f.padEnd(18)} ${last}`);
}
process.exit(failed ? 1 : 0);

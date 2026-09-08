// PxGrove build — assembles src/ into ONE self-contained HTML file.
//   node build/build.mjs                → dist/index.html   (standalone: doctype, viewport, noindex — for Hostinger)
//   node build/build.mjs --artifact     → dist/artifact.html (no skeleton — the claude.ai artifact wrapper adds it)
//   node build/build.mjs --label "TEST UI"   appends a label to the build stamp shown under the title
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const artifact = args.includes('--artifact');
const li = args.indexOf('--label');
const label = li >= 0 ? args[li + 1] : '';

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' };
const asset = (name) => {
  const p = resolve(root, 'src/assets', name);
  if (!existsSync(p)) throw new Error(`asset missing: ${name}`);
  return `data:${MIME[extname(name).toLowerCase()] || 'application/octet-stream'};base64,${readFileSync(p).toString('base64')}`;
};

// build stamp: Europe/Brussels, "YYYY-MM-DD HH:MM"
const stamp = (() => {
  const f = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Brussels', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
  return f.format(new Date()).replace('T', ' ').slice(0, 16) + (label ? ' · ' + label : '');
})();

let js = readFileSync(resolve(root, 'src/game.js'), 'utf8');
js = js.replace(/__ASSET__\('([^']+)'\)/g, (_, name) => `'${asset(name)}'`);
js = js.replace('__BUILD_STAMP__', stamp);
const css = readFileSync(resolve(root, 'src/styles.css'), 'utf8');
let html = readFileSync(resolve(root, 'src/index.html'), 'utf8');
html = html.replace('/*__CSS__*/', () => css).replace('/*__JS__*/', () => js);

mkdirSync(resolve(root, 'dist'), { recursive: true });
if (artifact) {
  writeFileSync(resolve(root, 'dist/artifact.html'), html);
  console.log(`dist/artifact.html  ${(html.length / 1024).toFixed(0)} KB  stamp ${stamp}`);
} else {
  const skeleton = '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta name="color-scheme" content="dark">\n<meta name="robots" content="noindex">\n<style>body{margin:0;font:14px system-ui,sans-serif;background:#333537}img{max-width:100%}[hidden]{display:none!important}</style>\n';
  const i = html.indexOf('<style>');
  const out = skeleton + html.slice(0, i) + '</head>\n<body>\n' + html.slice(i) + '\n</body>\n</html>\n';
  writeFileSync(resolve(root, 'dist/index.html'), out);
  console.log(`dist/index.html  ${(out.length / 1024).toFixed(0)} KB  stamp ${stamp}`);
}

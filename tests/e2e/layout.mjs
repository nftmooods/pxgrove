// Visual/layout acceptance test on dist/index.html (build first). Needs: npm i -D playwright && npx playwright install chromium
// Criteria: scene ratio == background ratio · bed compartments aligned on slots · bed bottom at 83 % · clicks select pots 1-2-3 · no page scroll · no JS error
import { chromium } from 'playwright';
import { resolve } from 'node:path';
const file = 'file://' + resolve('dist/index.html');
const br = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : {});
let fail = 0;
for (const [w, h] of [[1730, 950], [1366, 768], [1920, 1080], [1024, 768]]) {
  const pg = await br.newPage({ viewport: { width: w, height: h } }); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto(file); await pg.waitForTimeout(900);
  await pg.evaluate(() => { S.tutoSeen = true; S.tuto5Seen = true; S.tuto6Seen = true; document.getElementById('introOverlay').classList.remove('on'); setLang('fr'); S.inv.potAt = [true, true, true]; S.inv.potMatAt = ['clay', 'ground', 'clay']; ensurePlants(); for (let i = 0; i < 3; i++) if (!S.plants[i]) S.plants[i] = makePlant(null); S.sel = 0; showScreen('garden'); render(true); });
  await pg.waitForTimeout(900); await pg.evaluate(() => render(true)); await pg.waitForTimeout(300);
  const m = await pg.evaluate(() => {
    const cv = document.getElementById('plantCanvas'), r = cv.getBoundingClientRect(), img = sceneImage(), bed = bedImage();
    const sc = bedScale(), W = GW * CELL, x0 = 1.5 * W - BED_META.cx[1] * sc, comp = BED_META.cx.map(c => x0 + c * sc), slots = [0, 1, 2].map(k => slotCenterX(k));
    const dh = bed.naturalHeight * sc, y0 = BED_BOTTOM_FRAC * GH * CELL - BED_META.bottom * sc;
    return { boxR: r.width / r.height, imgR: img.naturalWidth / img.naturalHeight, bedBottom: (y0 + dh) / (cv.height / RES), align: comp.map((c, i) => Math.round(c - slots[i])), scrollH: document.documentElement.scrollHeight, innerH: innerHeight, cv: { l: r.left, t: r.top, w: r.width, h: r.height, cw: cv.width / RES, off: _viewOffX } };
  });
  const sel = [];
  for (let k = 0; k < 3; k++) { const wx = await pg.evaluate(k => slotCenterX(k), k); await pg.mouse.click(m.cv.l + (wx + m.cv.off) * (m.cv.w / m.cv.cw), m.cv.t + m.cv.h * 0.72); await pg.waitForTimeout(120); sel.push(await pg.evaluate(() => S.sel)); }
  const ok = Math.abs(m.boxR - m.imgR) < 0.03 && Math.abs(m.bedBottom - 0.83) <= 0.02 && m.align.every(a => Math.abs(a) <= 2) && sel.join() === '0,1,2' && m.scrollH <= m.innerH + 1 && errs.length === 0;
  if (!ok) fail++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${w}x${h} ratio ${m.boxR.toFixed(3)}/${m.imgR.toFixed(3)} bedBottom ${m.bedBottom.toFixed(3)} align ${m.align} sel ${sel} scroll ${m.scrollH}/${m.innerH} ${errs.join(' ')}`);
  await pg.screenshot({ path: `.tmp/layout_${w}x${h}.png` }); await pg.close();
}
await br.close(); process.exit(fail ? 1 : 0);

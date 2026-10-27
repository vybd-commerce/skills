// Compare text styling between a published Framer site and a storefront.
//
// Run from the storefront repo (it uses that repo's Playwright):
//   node <skills>/storefront-design/scripts/framer-compare.mjs \
//     https://<site>.framer.app http://localhost:3000 <outDir> / /about /contact
//
// For each page at 1440px and 390px it walks the page so lazy content mounts,
// records every text element's computed type and box on both sites, and writes
// <outDir>/report.txt (differences), data-*.json (raw values) and full-page
// screenshots. It also flags any element whose line height is smaller than its
// font size, the usual sign of a responsive override gone wrong.
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const {chromium} = require('@playwright/test');

const [ref, ours, outDir, ...rest] = process.argv.slice(2);
if (!ref || !ours || !outDir) {
  console.error('usage: framer-compare.mjs <framerUrl> <storefrontUrl> <outDir> [paths...]');
  process.exit(1);
}
const paths = rest.length ? rest : ['/'];
const widths = [1440, 390];
fs.mkdirSync(outDir, {recursive: true});

async function extract(page) {
  return page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const H = document.documentElement.scrollHeight;
    for (let y = 0; y < H; y += 300) {
      window.scrollTo(0, y);
      await sleep(80);
    }
    window.scrollTo(0, H);
    await sleep(1500);
    const sy = window.scrollY;
    const items = {};
    const tight = [];
    for (const el of document.querySelectorAll('body *')) {
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join('')
        .replace(/\s+/g, ' ')
        .trim();
      if (own.length < 3) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2) continue;
      const fs = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight);
      if (lh && lh < fs * 0.98) tight.push(`${fs}/${lh} "${own.slice(0, 40)}"`);
      const key = own.slice(0, 40).toLowerCase().replace(/[“”"’']/g, '');
      if (items[key]) continue;
      items[key] = {
        text: own.toLowerCase().replace(/[“”"’']/g, ''),
        fs,
        // Framer sets weight through the variable font's "wght" axis.
        fw: (cs.fontVariationSettings.match(/"wght" (\d+)/) || [])[1] || cs.fontWeight,
        lh: cs.lineHeight,
        ls: cs.letterSpacing,
        color: cs.color,
        ff: cs.fontFamily.split(',')[0].replace(/"/g, ''),
        w: Math.round(r.width),
        x: Math.round(r.left),
        y: Math.round(r.top + sy),
      };
    }
    return {height: document.documentElement.scrollHeight, items, tight};
  });
}

/** oklab() white/black and rgb() → comparable rgba strings. */
function normColor(c) {
  c = c.replace(/ /g, '');
  if (c.startsWith('oklab(')) {
    const L = parseFloat(c.slice(6));
    const a = (c.match(/\/([\d.]+)\)/) || [])[1] ?? '1';
    const v = L > 0.99 ? 255 : L < 0.01 ? 0 : `${Math.round(L * 255)}?`;
    return `rgba(${v},${v},${v},${a})`;
  }
  return c.replace(/^rgb\(([^)]*)\)$/, 'rgba($1,1)');
}
const family = (f) => f.replace(/ Variable$/, '');

const browser = await chromium.launch();
const report = [];
for (const width of widths) {
  for (const p of paths) {
    const data = {};
    for (const [name, base] of [['ref', ref], ['ours', ours]]) {
      const page = await browser.newPage({viewport: {width, height: 900}});
      await page.goto(base + p, {waitUntil: 'load', timeout: 60000}).catch(() => {});
      await page.waitForTimeout(2500);
      data[name] = await extract(page);
      const slug = p.replace(/\//g, '_') || '_';
      await page.screenshot({path: `${outDir}/${name}-${width}${slug}.png`, fullPage: true}).catch(() => {});
      await page.close();
    }
    const {ref: a, ours: b} = data;
    fs.writeFileSync(`${outDir}/data-${width}${p.replace(/\//g, '_') || '_'}.json`, JSON.stringify(data));
    report.push(`\n=== ${p} @ ${width}px   page height ref ${a.height} / ours ${b.height}`);
    for (const [k, r] of Object.entries(a.items)) {
      const o = b.items[k];
      if (!o) {
        const wrapped = Object.values(b.items).some((v) => v.text.includes(k.slice(0, 30)));
        if (!wrapped) report.push(`  MISSING in ours: "${k}"`);
        continue;
      }
      const d = [];
      if (Math.abs(r.fs - o.fs) > 0.5) d.push(`size ${r.fs}→${o.fs}`);
      if (r.fw !== o.fw) d.push(`weight ${r.fw}→${o.fw}`);
      if (r.lh !== o.lh) d.push(`lh ${r.lh}→${o.lh}`);
      if (r.ls !== o.ls) d.push(`ls ${r.ls}→${o.ls}`);
      if (normColor(r.color) !== normColor(o.color)) d.push(`color ${r.color}→${o.color}`);
      if (family(r.ff) !== family(o.ff)) d.push(`font ${r.ff}→${o.ff}`);
      if (Math.abs(r.w - o.w) > 8) d.push(`width ${r.w}→${o.w}`);
      if (Math.abs(r.x - o.x) > 8) d.push(`x ${r.x}→${o.x}`);
      if (Math.abs(r.y - o.y) > 24) d.push(`y ${r.y}→${o.y}`);
      if (d.length) report.push(`  "${k}": ${d.join(', ')}`);
    }
    for (const k of Object.keys(b.items)) {
      const inRef =
        a.items[k] ||
        Object.values(a.items).some((v) => k.includes(v.text.slice(0, 30)) || v.text.includes(k.slice(0, 30)));
      if (!inRef) report.push(`  EXTRA in ours: "${k}"`);
    }
    for (const t of b.tight) report.push(`  TIGHT line height in ours (font/line): ${t}`);
  }
}
await browser.close();
fs.writeFileSync(`${outDir}/report.txt`, report.join('\n'));
console.log(report.join('\n'));

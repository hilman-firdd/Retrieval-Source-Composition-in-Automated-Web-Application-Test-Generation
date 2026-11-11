/**
 * 06b-selector-extract-check.js — uji ekstraksi locator TANPA jaringan.
 *
 * 1. Uji unit kecil pada contoh yang diketahui jawabannya.
 * 2. Untuk setiap kondisi di generated/ (5 seed): jumlah locator v1 vs v2, dan berapa locator v1
 *    yang terpotong (kurung/kurung siku tidak seimbang, atau diakhiri '=').
 *
 * Pemakaian: node scripts/06b-selector-extract-check.js
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { extractSelectors, extractSelectorsV1 } = require('./lib/selectors');

const ROOT = path.resolve(__dirname, '..');
const v = (src) => extractSelectors(src).map((s) => `${s.kind}:${s.value}`);

// ---- 1. uji unit ----
assert.deepStrictEqual(v(`page.locator('input[name="email"]')`), ['locator:input[name="email"]']);
assert.deepStrictEqual(v(`page.locator("h3:has-text('Berita')")`), [`locator:h3:has-text('Berita')`]);
assert.deepStrictEqual(v(`await page.click('text=Galeri')`), ['locator:text=Galeri']);
assert.deepStrictEqual(v(`await page.fill('input[name="q"]', 'abc')`), ['locator:input[name="q"]']);
assert.deepStrictEqual(v(`page.getByRole('button', { name: 'Kirim' })`), ['role:button||Kirim']);
assert.deepStrictEqual(v(`page.getByRole('heading')`), ['role:heading||']);
assert.deepStrictEqual(v(`page.getByTestId('login')`), ['testid:login']);
assert.deepStrictEqual(v('page.locator(`a[href="/x"]`)'), ['locator:a[href="/x"]']);
assert.deepStrictEqual(v('page.locator(`#${id}`)'), []);
assert.deepStrictEqual(v(`page.locator('a[title="it\\'s"]')`), [`locator:a[title="it's"]`]);
assert.deepStrictEqual(v(`page.goto('/login')`), []);
console.log('uji unit: lulus\n');

// ---- 2. perbandingan pada skrip hasil generasi ----
const trunc = (s) => {
  const x = s.value;
  return (x.split('[').length !== x.split(']').length) || (x.split('(').length !== x.split(')').length) || /=$/.test(x);
};
const conds = process.argv[2] ? process.argv[2].split(',')
  : ['B0', 'B1', 'B2', 'P', 'P_no_req', 'P_no_hist', 'P_no_dom', 'B0__rerun', 'B0__neutral'];
console.log('Kondisi       skrip  locator v1  v1 terpotong  locator v2  v2 terpotong');
for (const c of conds) {
  const d = path.join(ROOT, 'generated', c);
  if (!fs.existsSync(d)) continue;
  let n = 0, a = 0, at = 0, b = 0, bt = 0;
  for (const run of fs.readdirSync(d).filter((r) => r.startsWith('seed'))) {
    for (const f of fs.readdirSync(path.join(d, run)).filter((x) => x.endsWith('.spec.js'))) {
      const src = fs.readFileSync(path.join(d, run, f), 'utf8');
      const s1 = extractSelectorsV1(src), s2 = extractSelectors(src);
      n++; a += s1.length; at += s1.filter(trunc).length; b += s2.length; bt += s2.filter(trunc).length;
    }
  }
  console.log(`${c.padEnd(13)} ${String(n).padStart(5)}  ${String(a).padStart(10)}  ${String(at).padStart(12)}  ${String(b).padStart(10)}  ${String(bt).padStart(12)}`);
}
console.log('\n"v2 terpotong" seharusnya hanya selector yang memang ditulis tidak seimbang oleh model.');

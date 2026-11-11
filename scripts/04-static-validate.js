/**
 * 04-static-validate.js
 *
 * Analisis statis terhadap setiap skrip hasil generasi, tanpa menjalankan browser.
 * Menghasilkan tiga metrik yang bisa langsung masuk tabel hasil:
 *   - Syntax Validity Rate      : lolos parsing Node.js
 *   - Selector Stability Profile: distribusi jenis selector (getByTestId .. XPath)
 *   - Anti-pattern Density      : waitForTimeout, assertion kosong, locator hardcoded index
 *
 * Pemakaian:
 *   node scripts/04-static-validate.js
 *   node scripts/04-static-validate.js --dir generated/P/seed11
 *   node scripts/04-static-validate.js --conditions B0__neutral,B0__rerun --out results/04-static-validation-neutral-ab.json
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GENERATED = path.join(ROOT, 'generated');

/**
 * Tingkat stabilitas selector, urut dari paling tahan perubahan DOM ke paling rapuh.
 * Klasifikasi ini yang nanti dipakai untuk membahas hasil uji mutasi DOM.
 */
const SELECTOR_PATTERNS = [
  { tier: 1, kind: 'getByTestId',     re: /getByTestId\s*\(/g },
  { tier: 1, kind: 'id',              re: /(?:locator|\$\$?)\s*\(\s*['"`]#[\w-]+/g },
  { tier: 2, kind: 'getByLabel',      re: /getByLabel\s*\(/g },
  { tier: 2, kind: 'getByPlaceholder',re: /getByPlaceholder\s*\(/g },
  { tier: 2, kind: 'getByRole',       re: /getByRole\s*\(/g },
  { tier: 2, kind: 'attrName',        re: /(?:locator|\$\$?)\s*\(\s*['"`][a-z]*\[name=/g },
  { tier: 3, kind: 'getByText',       re: /getByText\s*\(/g },
  { tier: 4, kind: 'cssClass',        re: /(?:locator|\$\$?)\s*\(\s*['"`][^'"`]*\.[a-zA-Z][\w-]+/g },
  { tier: 5, kind: 'xpath',           re: /(?:locator|\$x)\s*\(\s*['"`](?:xpath=)?\/\//g }
];

const ANTIPATTERNS = [
  { kind: 'waitForTimeout',  re: /waitForTimeout\s*\(/g,        note: 'sleep statis, penyebab flakiness paling umum' },
  { kind: 'nthHardcoded',    re: /\.nth\s*\(\s*\d+\s*\)/g,      note: 'indeks posisional, rapuh terhadap perubahan urutan DOM' },
  { kind: 'firstChained',    re: /\.first\s*\(\s*\)/g,          note: 'ambiguitas locator disembunyikan, bukan diselesaikan' },
  { kind: 'nakedSleep',      re: /setTimeout\s*\(/g,            note: 'sleep di luar mekanisme auto-wait Playwright' }
];

function listSpecDirs(base) {
  const dirs = [];
  if (!fs.existsSync(base)) return dirs;
  for (const cond of fs.readdirSync(base)) {
    const condPath = path.join(base, cond);
    if (!fs.statSync(condPath).isDirectory()) continue;
    for (const run of fs.readdirSync(condPath)) {
      const runPath = path.join(condPath, run);
      if (fs.statSync(runPath).isDirectory()) dirs.push({ condition: cond, run, dir: runPath });
    }
  }
  return dirs;
}

function checkSyntax(file) {
  const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (r.status === 0) return { valid: true, error: null };
  const msg = (r.stderr || '').split('\n').filter(Boolean).slice(0, 3).join(' | ');
  return { valid: false, error: msg.slice(0, 300) };
}

function analyseSource(src) {
  const selectors = {};
  let tierSum = 0;
  let tierCount = 0;

  for (const p of SELECTOR_PATTERNS) {
    const m = src.match(p.re);
    const n = m ? m.length : 0;
    if (n) {
      selectors[p.kind] = n;
      tierSum += p.tier * n;
      tierCount += n;
    }
  }

  const antipatterns = {};
  for (const a of ANTIPATTERNS) {
    const m = src.match(a.re);
    if (m) antipatterns[a.kind] = m.length;
  }

  const testCount = (src.match(/\btest\s*\(/g) || []).length;
  const assertCount = (src.match(/\bexpect\s*\(/g) || []).length;
  const gotoCount = (src.match(/\.goto\s*\(/g) || []).length;

  return {
    totalSelectors: tierCount,
    selectors,
    meanStabilityTier: tierCount ? +(tierSum / tierCount).toFixed(3) : null,
    antipatterns,
    antipatternCount: Object.values(antipatterns).reduce((a, b) => a + b, 0),
    testCount,
    assertCount,
    gotoCount,
    hasAssertion: assertCount > 0,
    linesOfCode: src.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).length
  };
}

function main() {
  const args = process.argv.slice(2);
  const arg = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : null);
  // --out menghindari menimpa results/04-static-validation.json (berisi 7 kondisi utama)
  const OUT = path.resolve(ROOT, arg('--out') || 'results/04-static-validation.json');
  const only = arg('--conditions') ? arg('--conditions').split(',') : null;
  const onlyDir = args.includes('--dir') ? path.resolve(ROOT, args[args.indexOf('--dir') + 1]) : null;

  const targets = onlyDir
    ? [{ condition: path.basename(path.dirname(onlyDir)), run: path.basename(onlyDir), dir: onlyDir }]
    : listSpecDirs(GENERATED).filter((t) => !only || only.includes(t.condition));

  if (!targets.length) {
    console.error('Tidak ada skrip di generated/. Jalankan scripts/03-generate.py lebih dulu.');
    process.exit(1);
  }

  const rows = [];
  for (const t of targets) {
    const files = fs.readdirSync(t.dir).filter((f) => f.endsWith('.spec.js'));
    for (const f of files) {
      const full = path.join(t.dir, f);
      const src = fs.readFileSync(full, 'utf8');
      const syntax = checkSyntax(full);
      rows.push({
        condition: t.condition,
        run: t.run,
        scenario_id: f.replace(/\.spec\.js$/, ''),
        file: path.relative(ROOT, full),
        syntaxValid: syntax.valid,
        syntaxError: syntax.error,
        ...analyseSource(src)
      });
    }
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2));

  // ringkasan konsol per kondisi
  const byCond = {};
  for (const r of rows) {
    const b = (byCond[r.condition] ||= { n: 0, valid: 0, assert: 0, anti: 0, tiers: [] });
    b.n += 1;
    if (r.syntaxValid) b.valid += 1;
    if (r.hasAssertion) b.assert += 1;
    b.anti += r.antipatternCount;
    if (r.meanStabilityTier !== null) b.tiers.push(r.meanStabilityTier);
  }

  console.log('\nKondisi   n     SyntaxValid   AdaAssertion   Antipattern/skrip   TierStabilitas');
  console.log('-'.repeat(84));
  for (const [c, b] of Object.entries(byCond)) {
    const tier = b.tiers.length ? (b.tiers.reduce((x, y) => x + y, 0) / b.tiers.length).toFixed(2) : '-';
    console.log(
      `${c.padEnd(10)}${String(b.n).padEnd(6)}` +
      `${((b.valid / b.n) * 100).toFixed(1).padStart(8)}%     ` +
      `${((b.assert / b.n) * 100).toFixed(1).padStart(6)}%          ` +
      `${(b.anti / b.n).toFixed(2).padStart(6)}            ${String(tier).padStart(6)}`
    );
  }
  console.log('\nTier stabilitas: 1 = paling tahan (testid/id), 5 = paling rapuh (XPath). Makin kecil makin baik.');
  console.log(`Rincian per skrip: ${path.relative(ROOT, OUT)}`);
}

main();

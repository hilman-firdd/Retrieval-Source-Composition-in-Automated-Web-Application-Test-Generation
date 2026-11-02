/**
 * 05-run-suite.js
 *
 * Menjalankan skrip hasil generasi dan mengumpulkan metrik eksekusi.
 * Satu berkas ini menangani tiga pengukuran karena mekanismenya identik:
 *
 *   Eksekusi normal      node scripts/05-run-suite.js --dir generated/P/seed11
 *   Uji flakiness        node scripts/05-run-suite.js --dir generated/P/seed11 --repeat 10
 *   Injeksi bug          node scripts/05-run-suite.js --dir generated/P/seed11 --perturb perturbations/faults.json
 *   Mutasi DOM           node scripts/05-run-suite.js --dir generated/P/seed11 --perturb perturbations/mutations.json
 *   Semua kondisi        node scripts/05-run-suite.js --all
 *
 * Setiap skrip dijalankan sebagai proses Playwright terpisah agar satu skrip yang
 * menggantung tidak merusak pengukuran skrip lain.
 *
 * Klasifikasi hasil per skrip:
 *   syntax_error  -> tidak dapat dimuat sama sekali (module/parse error)
 *   runtime_error -> dimuat tetapi gagal sebelum assertion (locator tidak ditemukan, timeout navigasi)
 *   failed        -> berjalan penuh, assertion tidak terpenuhi
 *   passed        -> berjalan penuh, semua assertion terpenuhi
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/experiment.config.json'), 'utf8'));

function parseArgs() {
  const a = process.argv.slice(2);
  const get = (flag, def = null) => (a.includes(flag) ? a[a.indexOf(flag) + 1] : def);
  return {
    dir: get('--dir'),
    all: a.includes('--all'),
    repeat: parseInt(get('--repeat', '1'), 10),
    perturb: get('--perturb'),
    tag: get('--tag', null)
  };
}

/** Arahkan require('@playwright/test') ke harness agar perturbasi bisa dipasang. */
function rewriteImport(src) {
  return src
    .replace(/require\(\s*['"]@playwright\/test['"]\s*\)/g, "require(process.env.HARNESS_PATH)")
    .replace(/from\s+['"]@playwright\/test['"]/g, 'from process.env.HARNESS_PATH');
}

function buildSandbox(specFile, scenarioId) {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'rtg-'));
  fs.mkdirSync(path.join(sandbox, 'tests'));
  const src = fs.readFileSync(specFile, 'utf8');
  fs.writeFileSync(path.join(sandbox, 'tests', `${scenarioId}.spec.js`), rewriteImport(src));

  const config = `
module.exports = {
  testDir: './tests',
  timeout: ${CONFIG.execution.playwrightTimeoutMs},
  expect: { timeout: 7000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['json', { outputFile: 'report.json' }]],
  use: {
    baseURL: ${JSON.stringify(CONFIG.sut.baseUrl)},
    headless: true,
    screenshot: 'off',
    video: 'off',
    trace: 'off',
    actionTimeout: 10000,
    navigationTimeout: 20000
  }
};
`;
  fs.writeFileSync(path.join(sandbox, 'playwright.config.js'), config);
  return sandbox;
}

function classify(report, stderr, exitCode) {
  if (!report) {
    const s = stderr || '';
    if (/SyntaxError|Unexpected token|Cannot find module/i.test(s)) return 'syntax_error';
    return 'runtime_error';
  }
  const specs = [];
  const walk = (suite) => {
    (suite.specs || []).forEach((sp) => specs.push(sp));
    (suite.suites || []).forEach(walk);
  };
  (report.suites || []).forEach(walk);

  if (!specs.length) return exitCode === 0 ? 'no_tests' : 'syntax_error';

  const results = specs.flatMap((sp) => sp.tests.flatMap((t) => t.results));
  const allPassed = results.every((r) => r.status === 'passed');
  if (allPassed) return 'passed';

  // Bedakan gagal assertion dari gagal locator/navigasi. Ini pembeda penting antara
  // "skrip berjalan tapi ekspektasinya salah" dan "skrip tidak bisa berinteraksi dengan aplikasi".
  const messages = results
    .flatMap((r) => (r.errors || []).map((e) => e.message || ''))
    .join(' ');
  const assertionish = /expect\(|toBeVisible|toHaveText|toHaveURL|toContainText|toHaveCount/i.test(messages);
  const locatorish = /locator resolved to 0|waiting for locator|Timeout .* exceeded|net::ERR|strict mode violation/i.test(messages);

  if (locatorish && !assertionish) return 'runtime_error';
  return 'failed';
}

function extractErrors(report) {
  if (!report) return [];
  const out = [];
  const walk = (suite) => {
    (suite.specs || []).forEach((sp) =>
      sp.tests.forEach((t) =>
        t.results.forEach((r) =>
          (r.errors || []).forEach((e) => out.push((e.message || '').split('\n').slice(0, 6).join('\n')))
        )
      )
    );
    (suite.suites || []).forEach(walk);
  };
  (report.suites || []).forEach(walk);
  return out;
}

function runOne(specFile, scenarioId, env) {
  const sandbox = buildSandbox(specFile, scenarioId);
  const started = Date.now();
  const proc = spawnSync('npx', ['playwright', 'test'], {
    cwd: sandbox,
    encoding: 'utf8',
    timeout: CONFIG.execution.playwrightTimeoutMs * 3,
    env: { ...process.env, ...env, HARNESS_PATH: path.join(ROOT, 'harness/hooked.js') }
  });
  const durationMs = Date.now() - started;

  let report = null;
  const reportPath = path.join(sandbox, 'report.json');
  if (fs.existsSync(reportPath)) {
    try { report = JSON.parse(fs.readFileSync(reportPath, 'utf8')); } catch (_) { report = null; }
  }

  const outcome = classify(report, (proc.stderr || '') + (proc.stdout || ''), proc.status);
  const errors = extractErrors(report);

  fs.rmSync(sandbox, { recursive: true, force: true });
  return { outcome, durationMs, errors, exitCode: proc.status };
}

function collectRunDirs(all, dir) {
  if (dir) {
    const abs = path.resolve(ROOT, dir);
    return [{ condition: path.basename(path.dirname(abs)), run: path.basename(abs), dir: abs }];
  }
  if (!all) return [];
  const base = path.join(ROOT, 'generated');
  const out = [];
  for (const cond of fs.readdirSync(base)) {
    const cp = path.join(base, cond);
    if (!fs.statSync(cp).isDirectory()) continue;
    for (const run of fs.readdirSync(cp)) {
      const rp = path.join(cp, run);
      if (fs.statSync(rp).isDirectory()) out.push({ condition: cond, run, dir: rp });
    }
  }
  return out;
}

function main() {
  const args = parseArgs();
  const targets = collectRunDirs(args.all, args.dir);
  if (!targets.length) {
    console.error('Tentukan --dir <folder> atau --all.');
    process.exit(1);
  }

  let perturbations = [{ id: null, description: 'baseline tanpa perturbasi' }];
  if (args.perturb) {
    const file = path.resolve(ROOT, args.perturb);
    perturbations = JSON.parse(fs.readFileSync(file, 'utf8')).perturbations;
    process.env.PERTURB_FILE = file;
  }

  const rows = [];
  for (const t of targets) {
    const files = fs.readdirSync(t.dir).filter((f) => f.endsWith('.spec.js'));
    for (const f of files) {
      const scenarioId = f.replace(/\.spec\.js$/, '');
      const specFile = path.join(t.dir, f);

      for (const p of perturbations) {
        const env = {};
        if (args.perturb) env.PERTURB_FILE = path.resolve(ROOT, args.perturb);
        if (p.id) env.PERTURB_ID = p.id;

        const outcomes = [];
        for (let rep = 0; rep < args.repeat; rep++) {
          const r = runOne(specFile, scenarioId, env);
          outcomes.push(r);
          const label = `${t.condition}/${t.run}/${scenarioId}` +
            (p.id ? ` [${p.id}]` : '') +
            (args.repeat > 1 ? ` rep${rep + 1}/${args.repeat}` : '');
          console.log(`${label.padEnd(64)} ${r.outcome.padEnd(14)} ${(r.durationMs / 1000).toFixed(1)}s`);
        }

        const statuses = outcomes.map((o) => o.outcome);
        const uniq = Array.from(new Set(statuses));
        rows.push({
          condition: t.condition,
          run: t.run,
          scenario_id: scenarioId,
          perturbation_id: p.id,
          perturbation_kind: p.kind || null,
          repeats: args.repeat,
          outcomes: statuses,
          final_outcome: uniq.length === 1 ? uniq[0] : 'inconsistent',
          flaky: uniq.length > 1,
          passed_count: statuses.filter((s) => s === 'passed').length,
          mean_duration_ms: Math.round(outcomes.reduce((a, o) => a + o.durationMs, 0) / outcomes.length),
          first_errors: outcomes[0].errors.slice(0, 2)
        });
      }
    }
  }

  const tag = args.tag || (args.perturb ? path.basename(args.perturb, '.json') : (args.repeat > 1 ? 'flakiness' : 'baseline'));
  const outFile = path.join(ROOT, `results/05-execution-${tag}.json`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({
    ranAt: new Date().toISOString(),
    baseUrl: CONFIG.sut.baseUrl,
    repeat: args.repeat,
    perturbationFile: args.perturb || null,
    rows
  }, null, 2));

  const byCond = {};
  for (const r of rows) {
    const b = (byCond[r.condition] ||= { n: 0, passed: 0, failed: 0, runtime: 0, syntax: 0, flaky: 0 });
    b.n += 1;
    if (r.final_outcome === 'passed') b.passed += 1;
    else if (r.final_outcome === 'failed') b.failed += 1;
    else if (r.final_outcome === 'runtime_error') b.runtime += 1;
    else if (r.final_outcome === 'syntax_error') b.syntax += 1;
    if (r.flaky) b.flaky += 1;
  }

  console.log('\nKondisi   n     Passed    Failed    RuntimeErr  SyntaxErr  Flaky');
  console.log('-'.repeat(70));
  for (const [c, b] of Object.entries(byCond)) {
    const pct = (x) => `${((x / b.n) * 100).toFixed(1)}%`.padStart(8);
    console.log(`${c.padEnd(10)}${String(b.n).padEnd(6)}${pct(b.passed)}${pct(b.failed)}${pct(b.runtime)}  ${pct(b.syntax)} ${pct(b.flaky)}`);
  }
  console.log(`\nHasil rinci: ${path.relative(ROOT, outFile)}`);
}

main();

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
 *   Subset               node scripts/05-run-suite.js --all --conditions B0__neutral --tag baseline-neutral
 *                        ... --perturb perturbations/faults.json --ids F02,F04,F06,F08,F09,F13 --tag faults-neutral
 *   Lengkapi cakupan     ... --skip-existing results/05-execution-faults.json --tag faults-completion
 *
 * Setiap skrip dijalankan sebagai proses Playwright terpisah agar satu skrip yang
 * menggantung tidak merusak pengukuran skrip lain.
 *
 * Klasifikasi hasil per skrip:
 *   syntax_error  -> tidak dapat dimuat sama sekali (module/parse error)
 *   harness_error -> sintaks valid tetapi Playwright tidak menghasilkan report (diulang 2x dulu); BUKAN salah skrip
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
    tag: get('--tag', null),
    // filter agar tidak menjalankan ulang seluruh generated/ (berjam-jam)
    conditions: get('--conditions') ? get('--conditions').split(',') : null,
    ids: get('--ids') ? get('--ids').split(',') : null,
    skipExisting: get('--skip-existing'),
    resume: a.includes('--resume'),
    scenarios: get('--scenarios') ? get('--scenarios').split(',') : null   // debug: hanya skenario ini
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

  if (!specs.length) {
    // Playwright menulis report TANPA spec bila berkas gagal dimuat; sebabnya ada di report.errors
    // (bukan di suite). Hanya galat parse yang benar-benar 'syntax_error'; sisanya masalah harness.
    const loadErr = (report.errors || []).map((e) => e.message || '').join(' ');
    if (loadErr) return /SyntaxError|Unexpected token/i.test(loadErr) ? 'syntax_error' : 'harness_error';
    return exitCode === 0 ? 'no_tests' : 'syntax_error';
  }

  const results = specs.flatMap((sp) => sp.tests.flatMap((t) => t.results));
  const allPassed = results.every((r) => r.status === 'passed');
  if (allPassed) return 'passed';

  // Bedakan gagal assertion dari gagal locator/navigasi. Ini pembeda penting antara
  // "skrip berjalan tapi ekspektasinya salah" dan "skrip tidak bisa berinteraksi dengan aplikasi".
  const messages = results
    .flatMap((r) => (r.errors || []).map((e) => e.message || ''))
    .join(' ');
  // Kegagalan lingkungan bukan hasil skrip: peramban tidak ada/tidak bisa start, atau SUT tidak terjangkau.
  if (/Executable doesn't exist|browserType\.launch|Please run the following command to download new browsers/i.test(messages)) return 'harness_error';
  if (/net::ERR_(NAME_NOT_RESOLVED|INTERNET_DISCONNECTED|CONNECTION_REFUSED|CONNECTION_TIMED_OUT|CERT)/i.test(messages)) return 'runtime_error';
  const assertionish = /expect\(|toBeVisible|toHaveText|toHaveURL|toContainText|toHaveCount/i.test(messages);
  const locatorish = /locator resolved to 0|waiting for locator|Timeout .* exceeded|net::ERR|strict mode violation/i.test(messages);

  if (locatorish && !assertionish) return 'runtime_error';
  return 'failed';
}

function extractErrors(report) {
  if (!report) return [];
  const out = (report.errors || []).map((e) => '[load] ' + (e.message || '').split('\n').slice(0, 8).join('\n'));
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

function runOnce(specFile, scenarioId, env) {
  const sandbox = buildSandbox(specFile, scenarioId);
  const started = Date.now();
  // Pakai Playwright LOKAL secara eksplisit. `npx playwright` di folder sementara (di luar repo)
  // dapat memakai versi lain; harness/hooked.js me-require @playwright/test lokal, sehingga dua
  // salinan Playwright berbeda memicu galat pemuatan dan seluruh run gagal tanpa pesan.
  const localBin = path.join(ROOT, 'node_modules', '.bin', 'playwright');
  const binDir = path.join(ROOT, 'node_modules', '.bin');
  const proc = spawnSync(fs.existsSync(localBin) ? localBin : 'npx',
    fs.existsSync(localBin) ? ['test'] : ['playwright', 'test'], {
    cwd: sandbox,
    encoding: 'utf8',
    timeout: CONFIG.execution.playwrightTimeoutMs * 3,
    env: { ...process.env, ...env, PATH: binDir + path.delimiter + (process.env.PATH || ''),
           HARNESS_PATH: path.join(ROOT, 'harness/hooked.js') }
  });
  const durationMs = Date.now() - started;

  let report = null;
  const reportPath = path.join(sandbox, 'report.json');
  if (fs.existsSync(reportPath)) {
    try { report = JSON.parse(fs.readFileSync(reportPath, 'utf8')); } catch (_) { report = null; }
  }

  const outcome = classify(report, (proc.stderr || '') + (proc.stdout || ''), proc.status);
  const errors = extractErrors(report);
  // Tanpa report.json, satu-satunya petunjuk penyebab ada di stderr; sebelumnya dibuang.
  if (!report) {
    // stderr bisa kosong bila proses tidak pernah berjalan (spawn gagal, dibunuh OS). Catat juga
    // status keluar, sinyal, dan galat spawn: itu yang membedakan 'kehabisan sumber daya' dari 'Playwright rusak'.
    const diag = `[diag] exit=${proc.status} signal=${proc.signal} spawnError=` +
      (proc.error ? `${proc.error.code || ''} ${proc.error.message}` : 'none');
    errors.push(`${diag}\n${((proc.stderr || '') + (proc.stdout || '')).trim().slice(-700)}`);
  }

  fs.rmSync(sandbox, { recursive: true, force: true });
  return { outcome, durationMs, errors, exitCode: proc.status };
}

function sourceParses(specFile) {
  return spawnSync(process.execPath, ['--check', specFile], { encoding: 'utf8' }).status === 0;
}

/**
 * classify() memakai 'syntax_error' sebagai penampung semua kegagalan tanpa report.json
 * (termasuk Playwright gagal start, kehabisan sumber daya, galat modul di harness). Label itu
 * hanya benar bila skrip memang tidak dapat diparse. Jika `node --check` lolos, kegagalan
 * dicoba ulang (maks 2x) dan, bila tetap gagal, dilabel 'harness_error', bukan kesalahan skrip,
 * supaya tidak terhitung sebagai skrip rusak atau sebagai 'cacat terdeteksi'.
 */
function runOne(specFile, scenarioId, env) {
  const infra = (r) => r.outcome === 'syntax_error' || r.outcome === 'harness_error';
  let r = runOnce(specFile, scenarioId, env);
  if (!infra(r)) return r;
  if (!sourceParses(specFile)) { r.outcome = 'syntax_error'; return r; }   // skrip memang rusak
  for (let i = 0; i < 2 && infra(r); i++) {
    console.log(`  ! ${scenarioId}: gagal dimuat padahal sintaks valid, coba ulang ${i + 1}/2`);
    r = runOnce(specFile, scenarioId, env);
  }
  if (infra(r)) {
    r.outcome = 'harness_error';
    console.log(`  ! ${scenarioId}: harness_error. Penyebab:\n${(r.errors[0] || '(tidak ada pesan)').split('\n').slice(0, 8).join('\n')}`);
  }
  return r;
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

/**
 * Pemeriksaan awal: peramban dapat start dan SUT terjangkau. Tanpa ini, run berjam-jam bisa
 * menghasilkan ribuan baris 'failed' yang sebenarnya hanya karena Chromium belum terpasang
 * (versi Playwright lokal menuntut build peramban tertentu) atau staging tidak terjangkau.
 */
function preflight() {
  const code = `
    const { chromium } = require('playwright');
    (async () => {
      try { const b = await chromium.launch(); await b.close(); console.log('BROWSER_OK'); }
      catch (e) { console.log('BROWSER_FAIL ' + String(e.message).split('\\n')[0]); }
      try { const r = await fetch(process.env.BASE_URL, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
            console.log('SUT_HTTP ' + r.status); }
      catch (e) { console.log('SUT_FAIL ' + ((e.cause && e.cause.code) || e.message)); }
    })();`;
  const r = spawnSync(process.execPath, ['-e', code], {
    cwd: ROOT, encoding: 'utf8', timeout: 90000, env: { ...process.env, BASE_URL: CONFIG.sut.baseUrl }
  });
  const out = (r.stdout || '') + (r.stderr || '');
  const problems = [];
  if (!/BROWSER_OK/.test(out)) problems.push('Peramban tidak bisa start: ' + ((out.match(/BROWSER_FAIL (.*)/) || [])[1] || out.trim().split('\n')[0] || 'tanpa pesan') + '\n  -> jalankan: npx playwright install chromium');
  const http = (out.match(/SUT_HTTP (\d+)/) || [])[1];
  if (!http) problems.push(`SUT tidak terjangkau (${(out.match(/SUT_FAIL (.*)/) || [])[1] || 'tanpa pesan'}): ${CONFIG.sut.baseUrl}`);
  else if (+http >= 500) problems.push(`SUT membalas HTTP ${http}: ${CONFIG.sut.baseUrl}`);
  if (problems.length) {
    console.error('PREFLIGHT GAGAL. Run dihentikan agar tidak menghasilkan baris tak valid:\n- ' + problems.join('\n- '));
    console.error('(lewati dengan --no-preflight bila memang disengaja)');
    process.exit(2);
  }
  console.log(`Preflight ok: peramban start, SUT HTTP ${http}.`);
}

function main() {
  const args = parseArgs();
  if (!process.argv.includes('--no-preflight')) preflight();
  const targets = collectRunDirs(args.all, args.dir).filter((t) => !args.conditions || args.conditions.includes(t.condition));
  if (!targets.length) {
    console.error('Tentukan --dir <folder> atau --all.');
    process.exit(1);
  }

  let perturbations = [{ id: null, description: 'baseline tanpa perturbasi' }];
  if (args.perturb) {
    const file = path.resolve(ROOT, args.perturb);
    perturbations = JSON.parse(fs.readFileSync(file, 'utf8')).perturbations;
    if (args.ids) perturbations = perturbations.filter((p) => args.ids.includes(p.id));
    process.env.PERTURB_FILE = file;
  }

  const tag = args.tag || (args.perturb ? path.basename(args.perturb, '.json') : (args.repeat > 1 ? 'flakiness' : 'baseline'));
  const outFile = path.join(ROOT, `results/05-execution-${tag}.json`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });

  // Lewati kombinasi (kondisi, run, skenario, perturbasi) yang sudah selesai:
  //   --resume                lanjutkan dari berkas keluaran run ini sendiri (hasil sebagian tersimpan berkala)
  //   --skip-existing <file>  lewati yang sudah ada di berkas lain (mis. pelengkapan cakupan)
  const done = new Set();
  const rows = [];
  const keyOf = (r) => [r.condition, r.run, r.scenario_id, r.perturbation_id].join('|');
  if (args.resume && fs.existsSync(outFile)) {
    const prev = JSON.parse(fs.readFileSync(outFile, 'utf8')).rows;
    prev.filter((r) => r.final_outcome !== 'harness_error' && r.final_outcome !== 'syntax_error').forEach((r) => { rows.push(r); done.add(keyOf(r)); });
    console.log(`Resume: ${rows.length} baris dipertahankan dari ${path.relative(ROOT, outFile)} (syntax_error/harness_error diulang).`);
  }
  if (args.skipExisting) {
    const f = path.resolve(ROOT, args.skipExisting);
    if (fs.existsSync(f)) JSON.parse(fs.readFileSync(f, 'utf8')).rows.forEach((r) => done.add(keyOf(r)));
    else console.warn(`PERINGATAN: ${args.skipExisting} tidak ada; tidak ada yang dilewati.`);
  }

  const save = () => {
    const tmp = outFile + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify({
      ranAt: new Date().toISOString(), baseUrl: CONFIG.sut.baseUrl, repeat: args.repeat,
      perturbationFile: args.perturb || null, partial: true, rows
    }));
    fs.renameSync(tmp, outFile);   // atomik: berkas tidak rusak bila proses terputus
  };

  for (const t of targets) {
    const files = fs.readdirSync(t.dir).filter((f) => f.endsWith('.spec.js'))
      .filter((f) => !args.scenarios || args.scenarios.includes(f.replace(/\.spec\.js$/, '')));
    for (const f of files) {
      const scenarioId = f.replace(/\.spec\.js$/, '');
      const specFile = path.join(t.dir, f);

      for (const p of perturbations) {
        if (done.has([t.condition, t.run, scenarioId, p.id].join('|'))) continue;
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
        if (rows.length % 10 === 0) save();
      }
    }
  }

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
    else if (r.final_outcome === 'harness_error') b.harness = (b.harness || 0) + 1;
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

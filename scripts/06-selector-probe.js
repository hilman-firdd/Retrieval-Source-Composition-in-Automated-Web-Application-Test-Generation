/**
 * 06-selector-probe.js
 *
 * Mengukur Selector Validity secara terpisah dari hasil eksekusi tes.
 *
 * Alasannya: sebuah skrip bisa gagal karena alur logikanya keliru meski semua selectornya
 * benar, atau sebaliknya lolos secara kebetulan. Memisahkan pengukuran ini membuat klaim
 * "RAG mengurangi halusinasi elemen" bisa dibuktikan langsung, bukan disimpulkan dari pass rate.
 *
 * Setiap selector diekstrak secara statis, lalu dicoba di-resolve pada halaman awal skenario.
 * Bila gagal di sana, dicoba pada seluruh route lain sebelum dinyatakan tidak valid.
 *
 * Pemakaian:
 *   node scripts/06-selector-probe.js --all
 *   node scripts/06-selector-probe.js --dir generated/P/seed11
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/experiment.config.json'), 'utf8'));
const SCENARIOS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scenarios/scenarios.json'), 'utf8')).scenarios;

/** Ekstraksi selector dari sumber. Menangkap bentuk locator string maupun getBy*. */
function extractSelectors(src) {
  const found = [];
  const push = (kind, value) => { if (value) found.push({ kind, value }); };

  const patterns = [
    [/(?:page|frame)\s*\.\s*locator\(\s*['"`]([^'"`]+)['"`]/g, 'locator'],
    [/(?:page|frame)\s*\.\s*\$\$?\(\s*['"`]([^'"`]+)['"`]/g, 'locator'],
    [/getByTestId\(\s*['"`]([^'"`]+)['"`]/g, 'testid'],
    [/getByLabel\(\s*['"`]([^'"`]+)['"`]/g, 'label'],
    [/getByPlaceholder\(\s*['"`]([^'"`]+)['"`]/g, 'placeholder'],
    [/getByText\(\s*['"`]([^'"`]+)['"`]/g, 'text'],
    [/getByRole\(\s*['"`]([^'"`]+)['"`]\s*,\s*\{\s*name:\s*['"`]([^'"`]+)['"`]/g, 'role']
  ];

  for (const [re, kind] of patterns) {
    let m;
    while ((m = re.exec(src)) !== null) {
      push(kind, kind === 'role' ? `${m[1]}||${m[2]}` : m[1]);
    }
  }
  // buang duplikat
  const seen = new Set();
  return found.filter((f) => {
    const key = `${f.kind}:${f.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function resolves(page, sel) {
  try {
    let loc;
    if (sel.kind === 'testid') loc = page.getByTestId(sel.value);
    else if (sel.kind === 'label') loc = page.getByLabel(sel.value);
    else if (sel.kind === 'placeholder') loc = page.getByPlaceholder(sel.value);
    else if (sel.kind === 'text') loc = page.getByText(sel.value);
    else if (sel.kind === 'role') {
      const [role, name] = sel.value.split('||');
      loc = page.getByRole(role, { name });
    } else loc = page.locator(sel.value);
    return (await loc.count()) > 0;
  } catch (_) {
    return false; // selector tidak valid secara sintaks juga dihitung tidak resolve
  }
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

(async () => {
  const args = process.argv.slice(2);
  const dir = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : null;
  const targets = collectRunDirs(args.includes('--all'), dir);
  if (!targets.length) {
    console.error('Tentukan --dir <folder> atau --all.');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = CONFIG.sut.baseUrl;

  // Muat setiap route sekali, simpan sebagai daftar untuk fallback pencarian.
  const routes = CONFIG.sut.routes;
  const rows = [];

  for (const t of targets) {
    const files = fs.readdirSync(t.dir).filter((f) => f.endsWith('.spec.js'));
    for (const f of files) {
      const scenarioId = f.replace(/\.spec\.js$/, '');
      const scenario = SCENARIOS.find((s) => s.id === scenarioId);
      const startPath = scenario ? scenario.start_path || '/' : '/';
      const src = fs.readFileSync(path.join(t.dir, f), 'utf8');
      const selectors = extractSelectors(src);

      let resolvedOnStart = 0;
      let resolvedAnywhere = 0;
      const unresolved = [];

      // coba di halaman awal skenario
      try {
        await page.goto(new URL(startPath, base).href, { waitUntil: 'networkidle', timeout: 30000 });
      } catch (_) { /* halaman tidak bisa dibuka, semua selector dihitung gagal di start */ }

      const pending = [];
      for (const s of selectors) {
        if (await resolves(page, s)) { resolvedOnStart++; resolvedAnywhere++; }
        else pending.push(s);
      }

      // fallback: cari di route lain
      for (const r of routes) {
        if (!pending.length) break;
        if (r.path === startPath) continue;
        try {
          await page.goto(new URL(r.path, base).href, { waitUntil: 'domcontentloaded', timeout: 20000 });
        } catch (_) { continue; }
        for (let i = pending.length - 1; i >= 0; i--) {
          if (await resolves(page, pending[i])) { resolvedAnywhere++; pending.splice(i, 1); }
        }
      }
      unresolved.push(...pending);

      const total = selectors.length;
      rows.push({
        condition: t.condition,
        run: t.run,
        scenario_id: scenarioId,
        total_selectors: total,
        resolved_on_start_page: resolvedOnStart,
        resolved_anywhere: resolvedAnywhere,
        selector_validity: total ? +(resolvedAnywhere / total).toFixed(4) : null,
        hallucinated_selectors: unresolved.map((u) => `${u.kind}:${u.value}`)
      });

      console.log(
        `${`${t.condition}/${t.run}/${scenarioId}`.padEnd(58)} ` +
        `${resolvedAnywhere}/${total} selector valid` +
        (unresolved.length ? `  (${unresolved.length} tidak ditemukan)` : '')
      );
    }
  }

  await browser.close();

  const out = path.join(ROOT, 'results/06-selector-validity.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ probedAt: new Date().toISOString(), rows }, null, 2));

  const byCond = {};
  for (const r of rows) {
    const b = (byCond[r.condition] ||= { tot: 0, res: 0, n: 0 });
    b.tot += r.total_selectors;
    b.res += r.resolved_anywhere;
    b.n += 1;
  }
  console.log('\nKondisi   skrip   selector   valid     Selector Validity');
  console.log('-'.repeat(60));
  for (const [c, b] of Object.entries(byCond)) {
    console.log(`${c.padEnd(10)}${String(b.n).padEnd(8)}${String(b.tot).padEnd(11)}${String(b.res).padEnd(10)}${((b.res / b.tot) * 100).toFixed(1)}%`);
  }
  console.log(`\nSelector yang tidak dapat di-resolve = halusinasi elemen. Rincian: ${path.relative(ROOT, out)}`);
})();

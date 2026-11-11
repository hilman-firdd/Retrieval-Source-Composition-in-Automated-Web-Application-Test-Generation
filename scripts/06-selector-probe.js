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
 *   node scripts/06-selector-probe.js --all --conditions B0__neutral,B0__rerun --out results/06-selector-validity-neutral-ab.json
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/experiment.config.json'), 'utf8'));
const SCENARIOS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scenarios/scenarios.json'), 'utf8')).scenarios;

// Ekstraksi locator v2: lihat scripts/lib/selectors.js (v1 memotong selector yang berisi
// tanda kutip, sehingga selector itu selalu terhitung tidak valid). Uji tanpa jaringan:
//   node scripts/06b-selector-extract-check.js
const { extractSelectors } = require('./lib/selectors');
const EXTRACTOR_VERSION = 'v2';

async function resolves(page, sel) {
  try {
    let loc;
    if (sel.kind === 'testid') loc = page.getByTestId(sel.value);
    else if (sel.kind === 'label') loc = page.getByLabel(sel.value);
    else if (sel.kind === 'placeholder') loc = page.getByPlaceholder(sel.value);
    else if (sel.kind === 'text') loc = page.getByText(sel.value);
    else if (sel.kind === 'alt') loc = page.getByAltText(sel.value);
    else if (sel.kind === 'title') loc = page.getByTitle(sel.value);
    else if (sel.kind === 'role') {
      const [role, name] = sel.value.split('||');
      loc = name ? page.getByRole(role, { name }) : page.getByRole(role);
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
  const arg = (f) => (args.includes(f) ? args[args.indexOf(f) + 1] : null);
  const dir = arg('--dir');
  const only = arg('--conditions') ? arg('--conditions').split(',') : null;
  const targets = collectRunDirs(args.includes('--all'), dir).filter((t) => !only || only.includes(t.condition));
  if (!targets.length) {
    console.error('Tentukan --dir <folder> atau --all.');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = CONFIG.sut.baseUrl;

  // Muat setiap route sekali, simpan sebagai daftar untuk fallback pencarian.
  // Rute cadangan = halaman yang benar-benar ditangkap ke knowledge base (kb/dom-snapshots/pruned/*.inventory.json).
  // v2 memakai CONFIG.sut.routes, yang ternyata masih daftar contoh (/profil, /berita, ...) dan bukan rute situs
  // (/portal/berita, /login, ...); akibatnya pencarian "di halaman lain" hampir tidak pernah mengenai halaman nyata.
  const KB_DIR = path.join(ROOT, 'kb/dom-snapshots/pruned');
  const kbRoutes = fs.existsSync(KB_DIR)
    ? fs.readdirSync(KB_DIR).filter((f) => f.endsWith('.inventory.json'))
        .map((f) => JSON.parse(fs.readFileSync(path.join(KB_DIR, f), 'utf8')).url)
        .filter(Boolean).map((u) => ({ path: new URL(u).pathname }))
    : [];
  const routes = kbRoutes.length ? kbRoutes : CONFIG.sut.routes;
  const ROUTES_SOURCE = kbRoutes.length ? 'kb' : 'config';
  console.log(`Rute cadangan (${ROUTES_SOURCE}): ${routes.map((r) => r.path).join(', ')}`);
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

  const out = path.resolve(ROOT, arg('--out') || 'results/06-selector-validity.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ probedAt: new Date().toISOString(), extractor: EXTRACTOR_VERSION, routes_source: ROUTES_SOURCE,
    fallback_routes: routes.map((r) => r.path), rows }, null, 2));

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

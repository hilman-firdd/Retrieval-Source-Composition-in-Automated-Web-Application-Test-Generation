/**
 * 01-capture-dom.js
 *
 * Menangkap DOM snapshot dari SUT dan menyiapkan dua bentuk artefak:
 *   1. kb/dom-snapshots/raw/<route>.html    -> HTML mentah (dipakai kondisi B1)
 *   2. kb/dom-snapshots/pruned/<route>.md   -> inventaris elemen terstruktur (dipakai B2 & P)
 *
 * Pruning terstruktur dipakai karena HTML mentah pada halaman modern hampir selalu
 * melebihi context window model 8B, dan literatur menunjukkan HTML yang telah diproses
 * parser menghasilkan tes yang lebih efektif dibanding HTML mentah.
 *
 * Pemakaian:
 *   node scripts/01-capture-dom.js
 *   node scripts/01-capture-dom.js --discover        # telusuri link internal, cetak route yang ditemukan
 *   node scripts/01-capture-dom.js --route ppdb      # hanya satu route
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/experiment.config.json'), 'utf8'));

const RAW_DIR = path.join(ROOT, 'kb/dom-snapshots/raw');
const PRUNED_DIR = path.join(ROOT, 'kb/dom-snapshots/pruned');

const args = process.argv.slice(2);
const DISCOVER = args.includes('--discover');
const ONLY_ROUTE = args.includes('--route') ? args[args.indexOf('--route') + 1] : null;

/**
 * Dijalankan di dalam konteks halaman. Mengambil setiap elemen yang dapat diinteraksikan
 * beserta atribut yang relevan untuk pembentukan selector.
 */
function extractInventory() {
  const SELECTOR = [
    'a[href]', 'button', 'input', 'select', 'textarea',
    '[role="button"]', '[role="link"]', '[role="tab"]', '[role="menuitem"]',
    'form', '[data-testid]', 'h1', 'h2', 'h3'
  ].join(',');

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  };

  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 120);

  const nodes = Array.from(document.querySelectorAll(SELECTOR));
  return nodes.filter(visible).map((el, i) => ({
    index: i,
    tag: el.tagName.toLowerCase(),
    type: el.getAttribute('type') || null,
    id: el.id || null,
    name: el.getAttribute('name') || null,
    testid: el.getAttribute('data-testid') || el.getAttribute('data-test') || null,
    role: el.getAttribute('role') || null,
    ariaLabel: el.getAttribute('aria-label') || null,
    placeholder: el.getAttribute('placeholder') || null,
    href: el.getAttribute('href') || null,
    action: el.getAttribute('action') || null,
    method: el.getAttribute('method') || null,
    required: el.hasAttribute('required') || null,
    className: clean(typeof el.className === 'string' ? el.className : ''),
    text: clean(el.innerText || el.value || '')
  }));
}

/** Menyusun rekomendasi selector Playwright dengan urutan stabilitas menurun. */
function suggestLocator(e) {
  if (e.testid) return `page.getByTestId('${e.testid}')`;
  if (e.id) return `page.locator('#${e.id}')`;
  if (e.ariaLabel) return `page.getByLabel('${e.ariaLabel}')`;
  if (e.placeholder) return `page.getByPlaceholder('${e.placeholder}')`;
  if (e.name) return `page.locator('${e.tag}[name="${e.name}"]')`;
  if (e.role && e.text) return `page.getByRole('${e.role}', { name: '${e.text}' })`;
  if (e.tag === 'button' && e.text) return `page.getByRole('button', { name: '${e.text}' })`;
  if (e.tag === 'a' && e.text) return `page.getByRole('link', { name: '${e.text}' })`;
  if (e.text) return `page.getByText('${e.text}')`;
  return null;
}

function renderPruned(route, url, title, inventory) {
  const L = [];
  L.push(`# Halaman: ${route.label}`);
  L.push('');
  L.push(`- route_id: ${route.id}`);
  L.push(`- path: ${route.path}`);
  L.push(`- url: ${url}`);
  L.push(`- title: ${title}`);
  L.push(`- captured_at: ${new Date().toISOString()}`);
  L.push('');

  const groups = {
    'Struktur judul': inventory.filter((e) => ['h1', 'h2', 'h3'].includes(e.tag)),
    'Formulir': inventory.filter((e) => e.tag === 'form'),
    'Kolom input': inventory.filter((e) => ['input', 'select', 'textarea'].includes(e.tag)),
    'Tombol': inventory.filter((e) => e.tag === 'button' || e.type === 'submit' || e.role === 'button'),
    'Tautan navigasi': inventory.filter((e) => e.tag === 'a')
  };

  for (const [heading, items] of Object.entries(groups)) {
    if (!items.length) continue;
    L.push(`## ${heading}`);
    L.push('');
    for (const e of items) {
      const attrs = [];
      if (e.type) attrs.push(`type=${e.type}`);
      if (e.id) attrs.push(`id=${e.id}`);
      if (e.name) attrs.push(`name=${e.name}`);
      if (e.testid) attrs.push(`data-testid=${e.testid}`);
      if (e.placeholder) attrs.push(`placeholder="${e.placeholder}"`);
      if (e.ariaLabel) attrs.push(`aria-label="${e.ariaLabel}"`);
      if (e.href) attrs.push(`href=${e.href}`);
      if (e.required) attrs.push('required');
      const loc = suggestLocator(e);
      L.push(`- <${e.tag}> ${e.text ? `"${e.text}" ` : ''}${attrs.length ? `[${attrs.join(', ')}]` : ''}`);
      if (loc) L.push(`  locator: ${loc}`);
    }
    L.push('');
  }
  return L.join('\n');
}

async function discover(page, baseUrl) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  const base = new URL(baseUrl);
  const found = new Set();
  for (const h of hrefs) {
    if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) continue;
    try {
      const u = new URL(h, baseUrl);
      if (u.hostname === base.hostname) found.add(u.pathname);
    } catch (_) { /* href tidak valid, lewati */ }
  }
  return Array.from(found).sort();
}

(async () => {
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(PRUNED_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  const baseUrl = CONFIG.sut.baseUrl;

  if (DISCOVER) {
    const paths = await discover(page, baseUrl);
    console.log('Route internal yang ditemukan:\n');
    paths.forEach((p) => console.log(`  { "id": "${p.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'}", "path": "${p}", "label": "" },`));
    console.log('\nSalin yang relevan ke config/experiment.config.json -> sut.routes');
    await browser.close();
    return;
  }

  const routes = ONLY_ROUTE
    ? CONFIG.sut.routes.filter((r) => r.id === ONLY_ROUTE)
    : CONFIG.sut.routes;

  const summary = [];

  for (const route of routes) {
    const url = new URL(route.path, baseUrl).href;
    process.stdout.write(`[capture] ${route.id.padEnd(16)} ${url} ... `);
    try {
      const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      const status = res ? res.status() : 0;
      if (status >= 400) {
        console.log(`HTTP ${status} — DILEWATI`);
        summary.push({ route: route.id, status, ok: false });
        continue;
      }
      await page.waitForTimeout(600); // beri ruang untuk render async

      const html = await page.content();
      const title = await page.title();
      const inventory = await page.evaluate(extractInventory);

      fs.writeFileSync(path.join(RAW_DIR, `${route.id}.html`), html, 'utf8');
      fs.writeFileSync(path.join(PRUNED_DIR, `${route.id}.md`), renderPruned(route, url, title, inventory), 'utf8');
      fs.writeFileSync(
        path.join(PRUNED_DIR, `${route.id}.inventory.json`),
        JSON.stringify({ route, url, title, inventory }, null, 2),
        'utf8'
      );

      console.log(`OK (${inventory.length} elemen, ${(html.length / 1024).toFixed(0)} KB HTML)`);
      summary.push({ route: route.id, status, ok: true, elements: inventory.length, rawKb: +(html.length / 1024).toFixed(1) });
    } catch (err) {
      console.log(`GAGAL: ${err.message}`);
      summary.push({ route: route.id, ok: false, error: err.message });
    }
  }

  fs.writeFileSync(
    path.join(ROOT, 'results/01-capture-summary.json'),
    JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl, summary }, null, 2)
  );

  await browser.close();
  const ok = summary.filter((s) => s.ok).length;
  console.log(`\nSelesai: ${ok}/${summary.length} route berhasil ditangkap.`);
})();

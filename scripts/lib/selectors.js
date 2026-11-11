/**
 * selectors.js — ekstraksi locator dari skrip Playwright (dipakai 06-selector-probe.js).
 *
 * v2 (11 Nov 2026). Memperbaiki dua cacat v1:
 *  1. v1 memakai pola ['"`]([^'"`]+)['"`], sehingga string selector yang berisi tanda
 *     kutip di dalamnya terpotong di kutip pertama. Contoh:
 *        page.locator('input[name="email"]')   -> v1: 'input[name='     (CSS tidak sah)
 *        page.locator('h3:has-text("Berita")') -> v1: 'h3:has-text('    (tidak sah)
 *     Selector terpotong selalu gagal di-resolve dan terhitung "halusinasi".
 *  2. v1 hanya membaca page.locator / page.$ / getBy*. Selector yang langsung diberikan ke
 *     aksi halaman (page.click('text=Galeri'), page.fill('input[name="q"]', ...)) tidak ikut.
 *
 * v2 membaca string literal secara utuh (kutip pembuka = kutip penutup, mendukung escape)
 * dan mencakup aksi halaman yang menerima selector sebagai argumen pertama.
 * Template literal yang berisi ${...} dilewati karena nilainya baru diketahui saat runtime.
 */

const STR = String.raw`(['"\x60])((?:\\.|(?!\1)[^\\])*)\1`;

// Aksi page/frame yang argumen pertamanya selector.
const PAGE_ACTIONS = [
  'locator', '\\$', '\\$\\$', '\\$eval', '\\$\\$eval', 'click', 'dblclick', 'tap', 'fill', 'type', 'press',
  'check', 'uncheck', 'hover', 'focus', 'selectOption', 'setInputFiles', 'dispatchEvent',
  'textContent', 'innerText', 'innerHTML', 'inputValue', 'getAttribute',
  'isVisible', 'isHidden', 'isChecked', 'isEnabled', 'isDisabled', 'isEditable', 'waitForSelector'
];

const unescape = (s) => s.replace(/\\(.)/g, '$1');

function extractSelectors(src) {
  const found = [];
  const add = (kind, value) => {
    if (value === undefined || value === null) return;
    if (value.includes('${')) return; // nilai runtime
    found.push({ kind, value });
  };
  const run = (re, fn) => { let m; while ((m = re.exec(src)) !== null) fn(m); };

  run(new RegExp(String.raw`(?:page|frame)\s*\.\s*(?:${PAGE_ACTIONS.join('|')})\s*\(\s*${STR}`, 'g'),
      (m) => add('locator', unescape(m[2])));
  for (const [fn, kind] of [['getByTestId', 'testid'], ['getByLabel', 'label'],
                            ['getByPlaceholder', 'placeholder'], ['getByText', 'text'],
                            ['getByAltText', 'alt'], ['getByTitle', 'title']]) {
    run(new RegExp(String.raw`${fn}\s*\(\s*${STR}`, 'g'), (m) => add(kind, unescape(m[2])));
  }
  // getByRole('button', { name: 'Kirim' }) dan getByRole('button') tanpa nama
  run(new RegExp(String.raw`getByRole\s*\(\s*${STR}\s*(?:,\s*\{[^}]*?name\s*:\s*${STR.replaceAll('\\1', '\\3')})?`, 'g'),
      (m) => add('role', `${unescape(m[2])}||${m[4] !== undefined ? unescape(m[4]) : ''}`));

  const seen = new Set();
  return found.filter((f) => {
    const key = `${f.kind}:${f.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Ekstraktor v1 (hanya untuk perbandingan di 06b-selector-extract-check.js). */
function extractSelectorsV1(src) {
  const found = [];
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
    while ((m = re.exec(src)) !== null) found.push({ kind, value: kind === 'role' ? `${m[1]}||${m[2]}` : m[1] });
  }
  const seen = new Set();
  return found.filter((f) => { const k = `${f.kind}:${f.value}`; if (seen.has(k)) return false; seen.add(k); return true; });
}

module.exports = { extractSelectors, extractSelectorsV1 };

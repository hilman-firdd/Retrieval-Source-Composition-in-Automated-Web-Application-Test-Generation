/**
 * harness/hooked.js
 *
 * Pembungkus tipis di atas @playwright/test. Skrip hasil generasi disalin ke direktori
 * eksekusi dengan baris require-nya diarahkan ke berkas ini, sehingga perturbasi DOM
 * (injeksi bug atau mutasi selector) dapat diterapkan tanpa menyentuh isi skrip sama sekali.
 *
 * Ini penting untuk validitas internal: skrip yang diuji pada kondisi normal dan pada
 * kondisi terperturbasi harus benar-benar berkas yang identik.
 *
 * Perturbasi diaktifkan lewat variabel lingkungan:
 *   PERTURB_FILE  path ke berkas JSON definisi perturbasi
 *   PERTURB_ID    id perturbasi yang dipakai pada eksekusi ini
 */

const fs = require('fs');
const base = require('@playwright/test');

function loadPerturbation() {
  const file = process.env.PERTURB_FILE;
  const id = process.env.PERTURB_ID;
  if (!file || !id) return null;
  const defs = JSON.parse(fs.readFileSync(file, 'utf8'));
  const found = (defs.perturbations || []).find((p) => p.id === id);
  if (!found) throw new Error(`Perturbasi "${id}" tidak ada di ${file}`);
  return found;
}

const perturbation = loadPerturbation();

const test = base.test.extend({
  page: async ({ page }, use) => {
    if (perturbation) {
      // Skrip dijalankan sebelum skrip halaman, lalu memasang dirinya pada dua titik:
      // DOMContentLoaded (elemen statis) dan timer pendek (elemen yang dirender belakangan).
      const content = `
        (() => {
          const apply = () => { try { ${perturbation.script} } catch (e) { console.warn('perturb:', e.message); } };
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', apply);
          } else {
            apply();
          }
          window.addEventListener('load', () => setTimeout(apply, 150));
        })();
      `;
      await page.addInitScript({ content });
    }
    await use(page);
  }
});

module.exports = { test, expect: base.expect, perturbation };

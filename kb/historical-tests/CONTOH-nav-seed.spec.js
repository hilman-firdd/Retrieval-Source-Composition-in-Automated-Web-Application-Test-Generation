// Contoh test case historis yang menjadi seed knowledge base.
// Tulis 8-12 skrip semacam ini secara manual sebelum menjalankan 02-build-index.py.
// Skrip inilah yang mengajarkan gaya penulisan dan pola locator yang diinginkan ke model.

const { test, expect } = require('@playwright/test');

test.describe('Navigasi utama', () => {
  test('beranda menampilkan menu dan judul utama', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('menu profil membuka halaman profil', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /profil/i }).first().click();
    await expect(page).toHaveURL(/profil/);
    await expect(page.getByRole('heading', { name: /profil/i })).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('Daftar berita', () => {
  test('daftar berita memuat sedikitnya satu judul', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.getByRole('heading', { name: 'Berita Terbaru' })).toBeVisible();
    const jumlahJudul = await page.locator('h3').count();
    expect(jumlahJudul).toBeGreaterThan(0);
  });

  test('judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulBeritaPertama = await page.locator('h3').first().textContent();
    await page.goto(`/portal/${judulBeritaPertama}`);
    await expect(page.getByRole('heading', { name: judulBeritaPertama })).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.getByRole('heading', { name: 'Berita Terbaru' })).toBeVisible();
    const judulBeritaDaftar = await page.locator('h3').first().textContent();

    await page.goto(`/portal/${await page.locator('h3').first().getAttribute('href')}`);
    await expect(page.getByRole('heading', { name: judulBeritaDaftar })).toBeVisible();
  });
});

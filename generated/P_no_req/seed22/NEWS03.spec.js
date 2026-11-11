const { test, expect } = require('@playwright/test');

test.describe('Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('NEWS03: Judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulBeritaPertama = await page.locator('h3').first().textContent();

    await page.goto('/portal/berita');
    const judulBeritaPertamaDetail = await page.locator('h1').first().textContent();

    expect(judulBeritaPertamaDetail).toBe(judulBeritaPertama);
  });
});

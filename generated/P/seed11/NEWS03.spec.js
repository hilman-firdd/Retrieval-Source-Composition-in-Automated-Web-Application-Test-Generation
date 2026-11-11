const { test, expect } = require('@playwright/test');

test.describe('Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulBeritaPertama = await page.locator('h3').first().textContent();

    await page.locator('h3').first().click();
    await page.waitForLoadState('networkidle');

    const judulBeritaDetail = await page.locator('h1').textContent();

    expect(judulBeritaDetail).toBe(judulBeritaPertama);
  });
});

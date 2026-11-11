const { test, expect } = require('@playwright/test');

test.describe('NEWS02: Membuka detail berita dari daftar', () => {
  test('Membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h1:has-text("Judul Berita")')).toBeVisible();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/portal/<slug-berita>');
  });
});

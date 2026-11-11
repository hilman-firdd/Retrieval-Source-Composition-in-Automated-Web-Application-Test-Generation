const { test, expect } = require('@playwright/test');

test.describe('INF01: Mengakses halaman brosur pesantren umum', () => {
  test('Halaman brosur pesantren umum terlihat', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/brosur-pesantren-umum');
    await expect(page.locator('h1:has-text("BROSUR PESANTREN UMUM")')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });
});

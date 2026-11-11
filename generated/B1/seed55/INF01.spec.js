const { test, expect } = require('@playwright/test');

test.describe('INF01: Mengakses halaman brosur pesantren umum', () => {
  test('Verify title and navigation menu', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/brosur-pesantren-umum');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });
});

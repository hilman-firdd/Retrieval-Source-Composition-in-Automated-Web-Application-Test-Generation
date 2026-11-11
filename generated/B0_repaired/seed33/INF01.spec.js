const { test, expect } = require('@playwright/test');

test.describe('INF01: Mengakses halaman brosur pesantren umum', () => {
  test('Mengakses halaman brosur pesantren umum', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/brosur-pesantren-umum');
    await expect(page.locator('a[target="_self"][data-test-id="brosur-pesantren-umum"]')).toHaveText('BROSUR PESANTREN UMUM');
    await expect(page.locator('nav')).toBeVisible();
  });
});

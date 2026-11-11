const { test, expect } = require('@playwright/test');

test.describe('INF01: Mengakses halaman brosur pesantren umum', () => {
  test('Verify brosur pesantren umum page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/brosur-pesantren-umum');
    await expect(page.locator('text="BROSUR PESANTREN UMUM"')).toBeVisible();
    await expect(page.locator('text=Menu navigasi')).toBeVisible();
  });
});

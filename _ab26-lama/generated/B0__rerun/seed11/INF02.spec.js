const { test, expect } = require('@playwright/test');

test.describe('INF02 - Membaca informasi jadwal atau alur PPDB', () => {
  test('PPDB page is displayed', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/ppdb');
    await expect(page.locator('h1:has-text("Pendaftaran Pesantren Persis 27")')).toBeVisible();
    await expect(page.locator('text="Alur Pendaftaran"')).toBeVisible();
  });
});

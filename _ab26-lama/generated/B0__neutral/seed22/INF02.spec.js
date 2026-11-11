const { test, expect } = require('@playwright/test');

test.describe('INF02 - Membaca informasi jadwal atau alur PPDB', () => {
  test('PPDB page is displayed', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/ppdb');
    await expect(page.locator('text=PPDB')).toBeVisible();
    await expect(page.locator('text=Pendaftaran')).toBeVisible();
  });
});

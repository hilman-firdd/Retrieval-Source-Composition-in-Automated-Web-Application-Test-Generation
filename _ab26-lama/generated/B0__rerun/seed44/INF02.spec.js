const { test, expect } = require('@playwright/test');

test.describe('INF02: Membaca informasi jadwal atau alur PPDB', () => {
  test('Verify PPDB page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/ppdb');
    await expect(page.locator('h1:has-text("Pendaftaran PPDB")')).toBeVisible();
    await expect(page.locator('text="Alur Pendaftaran"')).toBeVisible();
  });
});

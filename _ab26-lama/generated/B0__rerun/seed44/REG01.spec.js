const { test, expect } = require('@playwright/test');

test.describe('REG01: Membuka formulir pendaftaran dari halaman PPDB', () => {
  test('Membuka formulir pendaftaran', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/ppdb');
    await expect(page.locator('button:has-text("Daftar")')).toBeVisible();
    await page.locator('button:has-text("Daftar")').click();
    await expect(page.locator('form')).toBeVisible();
  });
});

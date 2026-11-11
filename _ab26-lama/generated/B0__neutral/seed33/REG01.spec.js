const { test, expect } = require('@playwright/test');

test.describe('REG01: Membuka formulir pendaftaran dari halaman PPDB', () => {
  test('Membuka formulir pendaftaran dari halaman PPDB', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/ppdb');
    await expect(page.locator('text="Daftar"')).toBeVisible();
    await page.locator('text="Daftar"').click();
    await expect(page.locator('text="Nama Lengkap"')).toBeVisible();
  });
});

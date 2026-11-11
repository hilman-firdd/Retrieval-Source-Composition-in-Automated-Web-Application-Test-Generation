const { test, expect } = require('@playwright/test');

test.describe('NAV08: Menangani alamat halaman yang tidak dikenal', () => {
  test('should display not found page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/halaman-tidak-ada-12345');
    await expect(page.locator('text="Halaman tidak ditemukan"')).toBeVisible();
  });

  test('should display navigation back to home', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/halaman-tidak-ada-12345');
    await expect(page.locator('text="Kembali ke Beranda"')).toBeVisible();
  });
});

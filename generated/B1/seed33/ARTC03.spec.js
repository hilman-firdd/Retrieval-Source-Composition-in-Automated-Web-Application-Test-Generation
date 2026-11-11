const { test, expect } = require('@playwright/test');

test.describe('ARTC03 - Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Menggunakan navigasi halaman pada daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('text="Artikel Santri"')).toBeVisible();
    await page.locator('text="Artikel Santri"').click();
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel?page=2');
    await expect(page.locator('text="Artikel Santri"')).not.toBeVisible();
    await expect(page.locator('text="Judul Artikel Pertama Halaman Kedua"')).toBeVisible();
  });
});

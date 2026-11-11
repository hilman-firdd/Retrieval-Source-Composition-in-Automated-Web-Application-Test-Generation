const { test, expect } = require('@playwright/test');

test.describe('ARTC03 - Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Navigasi halaman kedua daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('text="Artikel Santri"')).toBeVisible();
    await page.locator('text="Artikel Santri"').click();
    await page.locator('text="Halaman 2"').click();
    await expect(page.locator('text="Artikel Santri"')).toBeVisible();
    await expect(page.locator('text="Judul Artikel 1"')).toBeVisible();
    await expect(page.locator('text="Judul Artikel 2"')).toBeVisible();
  });
});

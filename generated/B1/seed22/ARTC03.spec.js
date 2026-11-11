const { test, expect } = require('@playwright/test');

test.describe('ARTC03 - Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Navigasi halaman kedua daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('text="Artikel Santri - Portal Pesantren PERSIS 27"')).toBeVisible();
    await page.locator('text="Artikel Santri - Portal Pesantren PERSIS 27"').click();
    await page.locator('text="Halaman 2"').click();
    await expect(page.locator('text="Artikel Santri - Portal Pesantren PERSIS 27"')).not.toBeVisible();
    await expect(page.locator('text="Judul Artikel Pertama Pada Halaman Kedua"')).toBeVisible();
  });
});

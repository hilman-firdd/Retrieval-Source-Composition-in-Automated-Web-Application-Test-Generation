const { test, expect } = require('@playwright/test');

test.describe('ARTC03 - Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Menggunakan navigasi halaman pada daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('a:has-text("Berikutnya")').click();
    await expect(page.locator('h1')).not.toBeVisible();
    await expect(page.locator('h1:has-text("Artikel Santri - Portal Pesantren PERSIS 27")')).not.toBeVisible();
  });
});

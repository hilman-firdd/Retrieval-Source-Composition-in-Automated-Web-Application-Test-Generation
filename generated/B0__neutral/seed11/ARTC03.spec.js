const { test, expect } = require('@playwright/test');

test.describe('ARTC03: Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Menggunakan navigasi halaman pada daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel?page=1');
    await expect(page.locator('text=Artikel 1')).toBeVisible();
    await page.locator('text=Halaman 2').click();
    await expect(page.locator('text=Artikel 2')).toBeVisible();
    await expect(page.locator('text=Artikel 2')).not.toBe('Artikel 1');
  });
});

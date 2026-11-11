const { test, expect } = require('@playwright/test');

test.describe('ARTC03 - Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Navigasi halaman daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('text="Berikutnya"').click();
    await expect(page.locator('h1')).not.toBeVisible();
    await page.locator('text="Sebelumnya"').click();
    await expect(page.locator('h1')).toBeVisible();
  });
});

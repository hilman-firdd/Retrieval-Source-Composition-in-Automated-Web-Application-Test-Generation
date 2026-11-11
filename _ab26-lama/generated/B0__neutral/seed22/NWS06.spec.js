const { test, expect } = require('@playwright/test');

test.describe('NWS06 - Kembali ke daftar berita dari halaman detail', () => {
  test('Kembali ke daftar berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita/1');
    await expect(page.locator('text="Berita"')).toBeVisible();
    await page.locator('text="Berita"').click();
    await expect(page.locator('text="Berita"')).toBeVisible();
  });
});

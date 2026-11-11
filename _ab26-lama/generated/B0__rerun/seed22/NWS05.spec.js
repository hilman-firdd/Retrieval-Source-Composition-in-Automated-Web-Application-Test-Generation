const { test, expect } = require('@playwright/test');

test.describe('NWS05: Memverifikasi tanggal terbit tercantum pada detail berita', () => {
  test('Memverifikasi tanggal terbit tercantum pada detail berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita/1');
    const tanggalTerbit = page.locator('text=Jumat, 17 Maret 2023');
    await expect(tanggalTerbit).toBeVisible();
  });
});

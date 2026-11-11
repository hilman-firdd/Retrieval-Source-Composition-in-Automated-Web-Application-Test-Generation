const { test, expect } = require('@playwright/test');

test.describe('NWS05: Memverifikasi tanggal terbit tercantum pada detail berita', () => {
  test('Tanggal terbit terlihat pada halaman detail', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita/1');
    const tanggalTerbit = page.locator('text=Terbit: *');
    await expect(tanggalTerbit).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('REG01: Mengakses halaman pendaftaran pesantren khusus', () => {
  test('Judul "PENDAFTARAN PESANTREN KHUSUS" terlihat', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-pesantren-khusus');
    const title = page.locator('a[target="_self"]::text("PENDAFTARAN PESANTREN KHUSUS"');
    await expect(title).toBeVisible();
  });
});

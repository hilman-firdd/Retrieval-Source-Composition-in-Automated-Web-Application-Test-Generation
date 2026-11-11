const { test, expect } = require('@playwright/test');

test.describe('REG01: Mengakses halaman pendaftaran pesantren khusus', () => {
  test('Halaman pendaftaran pesantren khusus terlihat', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-pesantren-khusus');
    const titleLocator = page.locator('h1:has-text("PENDAFTARAN PESANTREN KHUSUS")');
    await expect(titleLocator).toBeVisible();
  });
});

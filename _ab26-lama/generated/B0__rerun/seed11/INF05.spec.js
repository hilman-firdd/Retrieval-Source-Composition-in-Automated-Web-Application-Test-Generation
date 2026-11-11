const { test, expect } = require('@playwright/test');

test.describe('INF05: Memverifikasi alamat dan kontak pesantren pada halaman kontak', () => {
  test('Verify contact information', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/kontak');
    const addressLocator = page.locator('text=Alamat');
    await expect(addressLocator).toBeVisible();
    const contactLocator = page.locator('text=Nomor Telepon|Email');
    await expect(contactLocator).toBeVisible();
  });
});

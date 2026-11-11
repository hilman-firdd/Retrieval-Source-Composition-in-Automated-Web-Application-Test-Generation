const { test, expect } = require('@playwright/test');

test.describe('INF05: Memverifikasi alamat dan kontak pesantren pada halaman kontak', () => {
  test('Verify contact information', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/kontak');
    const alamatLocator = page.locator('text=Alamat');
    await expect(alamatLocator).toBeVisible();
    const kontakLocator = page.locator('text=Kontak');
    await expect(kontakLocator).toBeVisible();
  });
});

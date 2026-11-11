const { test, expect } = require('@playwright/test');

test.describe('INF05: Memverifikasi alamat dan kontak pesantren pada halaman kontak', () => {
  test('Verify contact information', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/kontak');
    await expect(page.locator('text=Alamat')).toBeVisible();
    await expect(page.locator('text=Telepon|Email')).toBeVisible();
  });
});

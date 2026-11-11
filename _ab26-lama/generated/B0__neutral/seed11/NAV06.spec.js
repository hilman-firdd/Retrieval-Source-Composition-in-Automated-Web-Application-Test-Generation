const { test, expect } = require('@playwright/test');

test.describe('NAV06: Membuka halaman kontak dari tautan footer', () => {
  test('Membuka halaman kontak dari tautan footer', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/');
    await page.locator('footer').click();
    await expect(page.locator('text=Kontak')).toBeVisible();
    await expect(page).toHaveURL(/kontak$/);
  });
});

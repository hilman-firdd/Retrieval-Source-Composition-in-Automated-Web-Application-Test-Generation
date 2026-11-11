const { test, expect } = require('@playwright/test');

test.describe('Navigasi - beranda', () => {
  test('beranda menampilkan identitas situs dan menu utama', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('h1')).toContainText('Pendidikan Adab Tafaqquh Fid Din');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('Modul Halaman Brosur Pesantren Umum', () => {
  test('Mengakses halaman brosur pesantren umum', async ({ page }) => {
    await page.goto('/portal/halaman/brosur-pesantren-umum');
    await expect(page.getByText('BROSUR PESANTREN UMUM')).toBeVisible();
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

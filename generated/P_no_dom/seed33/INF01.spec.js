const { test, expect } = require('@playwright/test');

test.describe('Mengakses halaman brosur pesantren umum', () => {
  test('halaman menampilkan judul dan menu navigasi', async ({ page }) => {
    await page.goto('/portal/halaman/brosur-pesantren-umum');
    await expect(page.getByRole('heading', { name: 'BROSUR PESANTREN UMUM' })).toBeVisible();
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('Mengakses halaman brosur pesantren umum', () => {
  test('halaman brosur menampilkan judul dan menu tetap tersedia', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/brosur-pesantren-umum');
    await expect(page.getByText('BROSUR PESANTREN UMUM')).toBeVisible();
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

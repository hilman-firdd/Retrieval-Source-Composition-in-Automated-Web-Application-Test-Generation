const { test, expect } = require('@playwright/test');

test.describe('Brosur pesantren umum', () => {
  test('halaman brosur menampilkan judul dan menu tetap tersedia', async ({ page }) => {
    await page.goto('/portal/halaman/brosur-pesantren-umum');
    await expect(page.getByRole('heading', { name: 'BROSUR PESANTREN UMUM' })).toBeVisible();
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

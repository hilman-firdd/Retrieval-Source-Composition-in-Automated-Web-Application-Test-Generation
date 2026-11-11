const { test, expect } = require('@playwright/test');

test.describe('NAV01 - Membuka beranda dan memverifikasi identitas situs', () => {
  test('beranda menampilkan identitas situs dan menu utama', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
  });
});

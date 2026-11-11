const { test, expect } = require('@playwright/test');

test.describe('Navigation - Beranda', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
  });
});

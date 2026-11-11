const { test, expect } = require('@playwright/test');

test.describe('Menu navigasi konsisten di seluruh halaman portal', () => {
  test('menu navigasi konsisten di beranda, berita, dan artikel', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/berita');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/artikel');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

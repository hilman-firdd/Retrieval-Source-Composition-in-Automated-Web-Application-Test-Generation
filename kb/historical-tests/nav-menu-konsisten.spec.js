const { test, expect } = require('@playwright/test');

test.describe('Navigasi - konsistensi menu', () => {
  test('menu utama tetap terlihat di beranda, berita, dan artikel', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/berita');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/artikel');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

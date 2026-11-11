const { test, expect } = require('@playwright/test');

test.describe('NAV04: Menu navigasi konsisten di seluruh halaman portal', () => {
  test('Menu navigasi konsisten di seluruh halaman portal', async ({ page }) => {
    await page.goto('/');

    // Assert #portalNavbar is visible
    await expect(page.locator('#portalNavbar')).toBeVisible();

    // Navigate to other pages
    await page.goto('/berita');
    await page.goto('/artikel');

    // Assert #portalNavbar is still visible on each page
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

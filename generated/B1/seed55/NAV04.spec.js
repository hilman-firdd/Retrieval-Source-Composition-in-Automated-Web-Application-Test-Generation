const { test, expect } = require('@playwright/test');

test.describe('NAV04: Menu navigasi konsisten di seluruh halaman portal', () => {
  test('Menu navigasi konsisten di seluruh halaman portal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    // Assert #portalNavbar is visible
    await expect(page.locator('#portalNavbar')).toBeVisible();

    // Navigate to other pages
    await page.goto('https://staging.pesantrenpersis27.com/beranda');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('https://staging.pesantrenpersis27.com/berita');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('https://staging.pesantrenpersis27.com/artikel');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NAV04 - Menu navigasi konsisten di seluruh halaman portal', () => {
  test('Menu navigasi konsisten di seluruh halaman portal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    // Assert #portalNavbar is visible on the home page
    await expect(page.locator('#portalNavbar')).toBeVisible();

    // Navigate to the news list page
    await page.goto('https://staging.pesantrenpersis27.com/news');

    // Assert #portalNavbar is still visible on the news list page
    await expect(page.locator('#portalNavbar')).toBeVisible();

    // Navigate to the article list page
    await page.goto('https://staging.pesantrenpersis27.com/article');

    // Assert #portalNavbar is still visible on the article list page
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

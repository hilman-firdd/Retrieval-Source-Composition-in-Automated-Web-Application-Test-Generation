const { test, expect } = require('@playwright/test');

test.describe('NAV04: Menu navigasi konsisten di seluruh halaman portal', () => {
  test('Menu navigasi konsisten di seluruh halaman portal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await page.goto('https://staging.pesantrenpersis27.com/news');
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await page.goto('https://staging.pesantrenpersis27.com/articles');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

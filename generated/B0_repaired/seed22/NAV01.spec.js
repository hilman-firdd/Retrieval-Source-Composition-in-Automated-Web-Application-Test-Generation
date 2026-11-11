const { test, expect } = require('@playwright/test');

test.describe('NAV01: Membuka beranda dan memverifikasi identitas situs', () => {
  test('Verify application title, navigation menu, and page title', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    const title = await expect(page.locator('text=Pesantren')).toBeVisible();
    const navigationMenu = await expect(page.locator('#portalNavbar')).toBeVisible();
    const pageTitle = await expect(page.locator('h1')).toBeVisible();
    expect(title).toBe(true);
    expect(navigationMenu).toBe(true);
    expect(pageTitle).toBe(true);
  });
});

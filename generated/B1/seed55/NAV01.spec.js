const { test, expect } = require('@playwright/test');

test.describe('NAV01: Membuka beranda dan memverifikasi identitas situs', () => {
  test('Verify page title', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page).toHaveTitleContaining('Pesantren');
  });

  test('Verify main navigation menu', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    const navMenu = await page.locator('#portalNavbar');
    await expect(navMenu).toBeVisible();
  });

  test('Verify page title', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    const pageTitle = await page.locator('h1');
    await expect(pageTitle).toBeVisible();
  });
});

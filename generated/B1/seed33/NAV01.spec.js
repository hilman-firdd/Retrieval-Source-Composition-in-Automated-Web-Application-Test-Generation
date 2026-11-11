const { test, expect } = require('@playwright/test');

test.describe('NAV01 - Membuka beranda dan memverifikasi identitas situs', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    // Assert that the document title contains the word "Pesantren"
    await expect(page).toHaveTitle(/Pesantren/);

    // Assert that the main navigation menu is visible
    await expect(page.locator('#portalNavbar')).toBeVisible();

    // Assert that the main title of the page is visible
    await expect(page.locator('h1')).toBeVisible();
  });
});

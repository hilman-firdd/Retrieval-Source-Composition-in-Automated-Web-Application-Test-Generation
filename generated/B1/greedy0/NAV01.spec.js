const { test, expect } = require('@playwright/test');

test.describe('NAV01 - Membuka beranda dan memverifikasi identitas situs', () => {
  test('Verify page title and navigation menu', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('h1')).toContainText('Pesantren');
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });
});

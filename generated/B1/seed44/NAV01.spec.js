const { test, expect } = require('@playwright/test');

test.describe('NAV01 - Membuka beranda dan memverifikasi identitas situs', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    await expect(page.locator('h1:has-text("Pesantren")')).toBeVisible();
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await expect(page.locator('h1:has-text("Portal Pesantren PERSIS 27 Situaksan")')).toBeVisible();
  });
});

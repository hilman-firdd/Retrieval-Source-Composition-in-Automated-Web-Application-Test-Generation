const { test, expect } = require('@playwright/test');

test.describe('NAV01: Membuka beranda dan memverifikasi identitas situs', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    const title = page.locator('h1:has-text("Pesantren")');
    await expect(title).toBeVisible();

    const navbar = page.locator('#portalNavbar');
    await expect(navbar).toBeVisible();

    const mainTitle = page.locator('h1');
    await expect(mainTitle).toBeVisible();
  });
});

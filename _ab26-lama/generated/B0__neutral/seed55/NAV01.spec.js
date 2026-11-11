const { test, expect } = require('@playwright/test');

test.describe('NAV01: Membuka beranda dan memverifikasi identitas situs', () => {
  test('Verify navigation and identity', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    const pesantrenTitle = page.locator('text=Pesantren Persis 27');
    await expect(pesantrenTitle).toBeVisible();

    const navigationMenu = page.locator('text=Menu Navigasi');
    await expect(navigationMenu).toBeVisible();

    const pageTitle = page.locator('h1');
    await expect(pageTitle).toBeVisible();
  });
});

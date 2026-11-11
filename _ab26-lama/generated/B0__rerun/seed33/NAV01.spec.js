const { test, expect } = require('@playwright/test');

test.describe('NAV01: Membuka beranda dan memverifikasi identitas situs', () => {
  test('Verify navigation', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('text="Pesantren Persis 27"')).toBeVisible();
    await expect(page.locator('role=navigation')).toBeVisible();
    await expect(page.locator('text="Beranda"')).toBeVisible();
  });
});

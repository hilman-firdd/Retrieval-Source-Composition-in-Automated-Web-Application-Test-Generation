const { test, expect } = require('@playwright/test');

test.describe('INF01: Membaca visi dan misi pada halaman profil', () => {
  test('Visi dan misi terlihat', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/profil');
    const visiLocator = page.locator('div[data-test-id="visi"]');
    await expect(visiLocator).toBeVisible();
    const misiLocator = page.locator('div[data-test-id="misi"]');
    await expect(misiLocator).toBeVisible();
  });
});

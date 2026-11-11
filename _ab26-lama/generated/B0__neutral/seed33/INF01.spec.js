const { test, expect } = require('@playwright/test');

test.describe('INF01: Membaca visi dan misi pada halaman profil', () => {
  test('Membaca visi dan misi pada halaman profil', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/profil');
    const visiLocator = page.locator('text=Visi');
    const misiLocator = page.locator('text=Misi');
    await expect(visiLocator).toBeVisible();
    await expect(misiLocator).toBeVisible();
  });
});

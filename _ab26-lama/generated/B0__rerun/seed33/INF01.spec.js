const { test, expect } = require('@playwright/test');

test.describe('INF01: Membaca visi dan misi pada halaman profil', () => {
  test('Membaca visi dan misi pada halaman profil', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/profil');
    await expect(page.locator('text=Visi')).toBeVisible();
    await expect(page.locator('text=Misi')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NAV02: Berpindah dari beranda ke halaman profil', () => {
  test('Navigation to profile page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/');
    await expect(page.locator('text=Profil')).toBeVisible();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/profil');
  });
});

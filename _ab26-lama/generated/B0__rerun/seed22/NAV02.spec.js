const { test, expect } = require('@playwright/test');

test.describe('NAV02: Berpindah dari beranda ke halaman profil', () => {
  test('Navigation to profile page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('a[title="Profil"]')).toBeVisible();
    await page.locator('a[title="Profil"]').click();
    await expect(page).toHaveURL(/\/profil/);
    await expect(page.locator('h1')).toBeVisible();
  });
});

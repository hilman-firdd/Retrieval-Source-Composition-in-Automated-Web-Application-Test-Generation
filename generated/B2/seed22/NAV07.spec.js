const { test, expect } = require('@playwright/test');

test.describe('NAV07: Membuka halaman login SIMASIS', () => {
  test('Membuka halaman login SIMASIS', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');

    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    await expect(page.getByText('SIMASIS - Sistem Manajemen Pesantren Persis 27')).toBeVisible();
  });
});

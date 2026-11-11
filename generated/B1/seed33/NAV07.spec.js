const { test, expect } = require('@playwright/test');

test.describe('NAV07 - Membuka halaman login SIMASIS', () => {
  test('Membuka halaman login SIMASIS', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
});

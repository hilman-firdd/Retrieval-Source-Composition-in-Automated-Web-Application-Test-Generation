const { test, expect } = require('@playwright/test');

test.describe('Membuka halaman login SIMASIS', () => {
  test('membuka halaman login SIMASIS', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('SIMASIS').first()).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });
});

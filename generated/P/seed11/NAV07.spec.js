const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - Membuka halaman login', () => {
  test('Membuka halaman login SIMASIS', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('SIMASIS').first()).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });
});

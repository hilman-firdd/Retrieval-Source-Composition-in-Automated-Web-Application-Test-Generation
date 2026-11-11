const { test, expect } = require('@playwright/test');

test.describe('AUTH01 - Menampilkan formulir login dengan lengkap', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[type="text"]').getByTestId('username')).toBeVisible();
    await expect(page.locator('input[type="password"]').getByTestId('password')).toBeVisible();
    await expect(page.locator('button[type="submit"]').getByTestId('login')).toBeVisible();
  });
});

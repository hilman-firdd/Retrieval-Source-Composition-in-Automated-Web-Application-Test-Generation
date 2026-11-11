const { test, expect } = require('@playwright/test');

test.describe('AUTH01: Menampilkan formulir login dengan lengkap', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button:has-text("Masuk")')).toBeVisible();
  });
});

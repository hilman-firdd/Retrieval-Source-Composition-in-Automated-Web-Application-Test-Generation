const { test, expect } = require('@playwright/test');

test.describe('AUTH01 - Menampilkan formulir login dengan lengkap', () => {
  test('Menampilkan formulir login dengan lengkap', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');

    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

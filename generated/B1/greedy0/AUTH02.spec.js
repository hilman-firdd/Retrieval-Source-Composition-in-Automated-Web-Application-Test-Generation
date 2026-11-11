const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('Validasi formulir login pada kiriman kosong', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').first()).toBeVisible();
    await expect(page.locator('input[name="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').first()).toBeDisabled();
  });
});

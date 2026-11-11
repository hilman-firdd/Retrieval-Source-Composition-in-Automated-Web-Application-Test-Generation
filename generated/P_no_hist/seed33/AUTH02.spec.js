const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('should not submit the form when username and password are empty', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').locator('required')).toBeVisible();
    await expect(page.locator('input[name="password"]').locator('required')).toBeVisible();
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('/login');
    await expect(page.locator('input[name="username"]').locator('required')).toBeVisible();
    await expect(page.locator('input[name="password"]').locator('required')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('should not submit empty form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').first()).toBeVisible();
    await expect(page.locator('input[name="username"]').first()).not.toBeFocused();
    await expect(page.locator('input[name="username"]').first()).not.toHaveValue();
    await expect(page.locator('input[name="username"]').first()).not.toHaveAttribute('validation-message');
    await page.locator('button:has-text("Masuk")').click();
    await expect(page).toHaveUrl('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').first()).toBeVisible();
    await expect(page.locator('input[name="username"]').first()).toHaveAttribute('validation-message');
  });
});

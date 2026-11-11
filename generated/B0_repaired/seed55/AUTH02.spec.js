const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('should not submit empty form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('[data-test="username"]').first().locator('input')).toBeVisible();
    await expect(page.locator('[data-test="password"]').first().locator('input')).toBeVisible();
    await expect(page.locator('button:has-text("Masuk")')).toBeVisible();
    await page.locator('button:has-text("Masuk"]').click();
    await expect(page).toHaveURL('/login');
    await expect(page.locator('[data-test="username"]').first().locator('input')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('[data-test="username"]').first()).toBeVisible();
  });
});

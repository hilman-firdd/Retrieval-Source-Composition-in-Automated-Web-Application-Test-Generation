const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('should not submit empty form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('[data-test-id="username"]').locator('input')).toBeVisible();
    await expect(page.locator('[data-test-id="username"]').locator('input')).not.toBeFocused();
    await page.locator('button:has-text("Masuk")').click();
    await expect(page).toHaveUrl('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('[data-test-id="username"]').locator('input')).toBeRequired();
    await expect(page.locator('[data-test-id="username"]').locator('input')).toBeVisible();
    await expect(page.locator('[data-test-id="username"]').locator('input')).toBeRequired();
    await expect(page.locator('[data-test-id="username"]').locator('input')).not.toBeFocused();
  });
});

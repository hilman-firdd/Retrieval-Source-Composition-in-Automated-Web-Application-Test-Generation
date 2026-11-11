const { test, expect } = require('@playwright/test');

test.describe('AUTH03 - Penolakan kredensial login yang tidak valid', () => {
  test('Invalid credentials', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.fill('[data-test="username"]', 'invalid-username');
    await page.fill('[data-test="password"]', 'invalid-password');
    await page.click('[data-test="login-button"]');
    await expect(page.locator('[data-test="error-message"]')).toBeVisible();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/login');
  });
});

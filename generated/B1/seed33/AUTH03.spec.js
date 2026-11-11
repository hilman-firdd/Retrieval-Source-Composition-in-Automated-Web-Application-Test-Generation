const { test, expect } = require('@playwright/test');

test.describe('AUTH03: Penolakan kredensial login yang tidak valid', () => {
  test('should reject invalid login credentials', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.fill('input[name="username"]', 'invalid-username');
    await page.fill('input[name="password"]', 'invalid-password');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="These credentials do not match our records."')).toBeVisible();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/login');
  });
});

const { test, expect } = require('@playwright/test');

test.describe('AUTH03: Penolakan kredensial login yang tidak valid', () => {
  test('Invalid login credentials', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.locator('[name="username"]').fill('invalid-username');
    await page.locator('[name="password"]').fill('invalid-password');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text="These credentials do not match our records."')).toBeVisible();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/login');
  });
});

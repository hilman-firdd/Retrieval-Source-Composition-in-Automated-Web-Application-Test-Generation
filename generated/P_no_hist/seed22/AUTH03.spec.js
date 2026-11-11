const { test, expect } = require('@playwright/test');

test.describe('AUTH03 - Penolakan kredensial login yang tidak valid', () => {
  test('Penolakan kredensial login yang tidak valid', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.fill('#username', 'invalid-username');
    await page.fill('#password', 'invalid-password');
    await page.locator('button:has-text("Masuk")').click();
    await expect(page.locator('text="These credentials do not match our records."')).toBeVisible();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/login');
  });
});

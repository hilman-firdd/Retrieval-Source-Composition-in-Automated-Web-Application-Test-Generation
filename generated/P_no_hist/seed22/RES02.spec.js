const { test, expect } = require('@playwright/test');

test.describe('RES02: Login berulang dengan kredensial salah tidak merusak halaman', () => {
  test('should not break the login form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.fill('#username', 'invalid-username');
    await page.fill('#password', 'invalid-password');
    await page.locator('text="Masuk"').click();
    await expect(page.locator('text="These credentials do not match our records."')).toBeVisible();
    await page.fill('#username', 'invalid-username');
    await page.fill('#password', 'invalid-password');
    await page.locator('text="Masuk"').click();
    await expect(page.locator('text="These credentials do not match our records."')).toBeVisible();
    await page.fill('#username', 'invalid-username');
    await page.fill('#password', 'invalid-password');
    await page.locator('text="Masuk"').click();
    await expect(page.locator('text="These credentials do not match our records."')).toBeVisible();
  });
});

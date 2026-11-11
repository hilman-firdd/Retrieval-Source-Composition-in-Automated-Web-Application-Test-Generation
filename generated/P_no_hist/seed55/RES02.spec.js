const { test, expect } = require('@playwright/test');

test.describe('RES02 - Login berulang dengan kredensial salah tidak merusak halaman', () => {
  test('Login with invalid credentials', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.fill('#username', 'invalid-username');
    await page.fill('#password', 'invalid-password');
    await page.click('button:has-text("Masuk")');
    await expect(page.locator('text="These credentials do not match our records."')).toBeVisible();
    await page.fill('#username', 'invalid-username');
    await page.fill('#password', 'invalid-password');
    await page.click('button:has-text("Masuk")');
    await expect(page.locator('text="These credentials do not match our records."')).toBeVisible();
    await page.fill('#username', 'invalid-username');
    await page.fill('#password', 'invalid-password');
    await page.click('button:has-text("Masuk")');
    await expect(page.locator('text="These credentials do not match our records."')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('RES02: Login berulang dengan kredensial salah tidak merusak halaman', () => {
  test('Login with incorrect credentials', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.fill('input[name="username"]', 'wrong-username');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button[type="submit"]');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('div.invalid-feedback')).toBeVisible();
    await page.fill('input[name="username"]', 'wrong-username');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button[type="submit"]');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('div.invalid-feedback')).toBeVisible();
    await page.fill('input[name="username"]', 'wrong-username');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button[type="submit"]');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('div.invalid-feedback')).toBeVisible();
  });
});

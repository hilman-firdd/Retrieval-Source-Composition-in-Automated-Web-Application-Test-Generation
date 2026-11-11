const { test, expect } = require('@playwright/test');

test.describe('RES02 - Login berulang dengan kredensial salah tidak merusak halaman', () => {
  test('Login berulang dengan kredensial salah tidak merusak halaman', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await page.fill('input[name="username"]', 'wrong-username');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Username or password is incorrect')).toBeVisible();
    await page.fill('input[name="username"]', 'wrong-username');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Username or password is incorrect')).toBeVisible();
    await page.fill('input[name="username"]', 'wrong-username');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Username or password is incorrect')).toBeVisible();
  });
});

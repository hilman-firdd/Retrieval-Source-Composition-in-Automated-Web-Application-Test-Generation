const { test, expect } = require('@playwright/test');

test.describe('AUTH01 - Menampilkan formulir login dengan lengkap', () => {
  test('Formulir login terlihat', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    const usernameInput = page.locator('input[type="text"][data-testid="username"]');
    const passwordInput = page.locator('input[type="password"][data-testid="password"]');
    const submitButton = page.locator('button[type="submit"][data-testid="submit"]');
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});

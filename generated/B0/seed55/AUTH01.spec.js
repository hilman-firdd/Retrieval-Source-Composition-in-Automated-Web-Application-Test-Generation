const { test, expect } = require('@playwright/test');

test.describe('AUTH01: Menampilkan formulir login dengan lengkap', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    const usernameInput = page.locator('input[type="text"][data-test-id="username"]');
    const passwordInput = page.locator('input[type="password"][data-test-id="password"]');
    const submitButton = page.locator('button[type="submit"][data-test-id="submit"]');
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});

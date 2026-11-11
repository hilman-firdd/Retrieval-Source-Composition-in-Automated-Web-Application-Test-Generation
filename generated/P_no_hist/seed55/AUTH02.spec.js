const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('should not submit the form when username and password are empty', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[type="text"][data-testid="username"]').toBeVisible());
    await expect(page.locator('input[type="password"][data-testid="password"]').toBeVisible());
    await expect(page.locator('button[type="submit"]').toBeVisible());
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('input[type="text"][data-testid="username"]').hasText('Please fill out this field.'));
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/login');
  });
});

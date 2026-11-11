const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('should not submit the form with empty fields', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').getByText('Username')).toBeVisible();
    await expect(page.locator('input[name="password"]').getByText('Password')).toBeVisible();
    await expect(page.locator('button[type="submit"]').getByText('Masuk')).toBeVisible();
    await page.fill('input[name="username"]', '');
    await page.fill('input[name="password"]', '');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').getByText('Username')).toBeVisible();
    await expect(page.locator('input[name="password"]').getByText('Password')).toBeVisible();
  });
});

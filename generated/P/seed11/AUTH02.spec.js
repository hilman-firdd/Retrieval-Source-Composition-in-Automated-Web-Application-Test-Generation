const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - validasi formulir login pada kiriman kosong', () => {
  test('validasi formulir login pada kiriman kosong', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#username').locator('input')).toBeVisible();
    await expect(page.locator('#username').locator('input').getAttribute('validationMessage')).toBe('Please fill out this field.');
  });
});

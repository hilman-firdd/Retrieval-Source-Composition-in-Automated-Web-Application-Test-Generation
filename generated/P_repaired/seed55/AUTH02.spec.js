const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - validasi formulir login pada kiriman kosong', () => {
  test('validasi formulir login pada kiriman kosong', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('');
    await page.locator('#password').fill('');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#username').getByPlaceholder('Masukkan email atau username')).toBeVisible();
    await expect(page.locator('#username').getByPlaceholder('Masukkan email atau username').validationMessage).toBe('Please fill out this field.');
  });
});

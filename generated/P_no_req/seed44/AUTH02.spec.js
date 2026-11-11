const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('validasi formulir login pada kiriman kosong', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('');
    await page.locator('#password').fill('');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#username').locator('input')).toHaveAttribute('aria-invalid', 'true');
  });
});

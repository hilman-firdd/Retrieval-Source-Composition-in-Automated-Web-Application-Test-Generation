const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('kiriman kosong ditahan oleh validasi bawaan peramban', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('');
    await page.locator('#password').fill('');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#username').locator('input')).toBeVisible();
    await expect(page.locator('#username').locator('input').locator('small')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - Validasi formulir login pada kiriman kosong', () => {
  test('kiriman kosong ditahan oleh validasi bawaan peramban', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.locator('[data-test="username"]').fill('');
    await page.locator('[data-test="password"]').fill('');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('[data-test="username"]').locator('input')).toHaveAttribute('aria-invalid', 'true');
  });
});

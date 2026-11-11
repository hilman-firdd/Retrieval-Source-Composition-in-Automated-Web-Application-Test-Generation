const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - Validasi formulir login pada kiriman kosong', () => {
  test('kiriman kosong ditahan oleh validasi bawaan peramban', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.locator('[data-testid="username"]').fill('');
    await page.locator('[data-testid="password"]').fill('');
    await page.locator('[data-testid="submit"]').click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('[data-testid="username"]').locator('input')).toHaveAttribute('aria-invalid', 'true');
  });
});

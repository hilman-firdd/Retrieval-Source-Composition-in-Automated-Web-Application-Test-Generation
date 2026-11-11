const { test, expect } = require('@playwright/test');

test.describe('AUTH02: Validasi formulir login pada kiriman kosong', () => {
  test('should not submit empty form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').getByPlaceholder('Username')).toBeVisible();
    await expect(page.locator('input[name="password"]').getPlaceholder()).toBe('Password');
    await expect(page.locator('button[type="submit"]').getByText('Masuk')).toBeVisible();
    await page.locator('button[type="submit"]').getByText('Masuk').click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').getByPlaceholder('Username')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('input[name="username"]').getByPlaceholder('Username')).toBeVisible();
  });
});

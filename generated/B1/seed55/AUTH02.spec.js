const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('should not submit the form with empty fields', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').first()).toBeVisible();
    await expect(page.locator('input[name="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();
    await page.fill('input[name="username"]', '');
    await page.fill('input[name="password"]', '');
    await page.locator('button[type="submit"]').first().click();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').first()).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('input[name="username"]').first()).toHaveText('Username tidak boleh kosong');
  });
});

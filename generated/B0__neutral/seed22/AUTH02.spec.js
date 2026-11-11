const { test, expect } = require('@playwright/test');

test.describe('AUTH02: Validasi formulir login pada kiriman kosong', () => {
  test('should not submit empty form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[name="username"]').locator('placeholder')).toBeVisible();
    await expect(page.locator('input[name="username"]').locator('placeholder')).toHaveText('Username');
    await expect(page.locator('button[type="submit"]').locator('disabled')).toBeTrue();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/login');
  });
});

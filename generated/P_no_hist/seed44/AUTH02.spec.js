const { test, expect } = require('@playwright/test');

test.describe('AUTH02 - Validasi formulir login pada kiriman kosong', () => {
  test('should not submit empty form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await expect(page.locator('input[type="text"][required]').toBeVisible());
    await expect(page.locator('input[type="password"][required]').toBeVisible());
    await expect(page.locator('button[type="submit"]').toBeVisible());
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('/login');
    await expect(page.locator('input[type="text"][required]').locator('::after').toHaveText('Please fill out this field.'));
  });
});

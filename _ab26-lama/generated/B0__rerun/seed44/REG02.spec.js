const { test, expect } = require('@playwright/test');

test.describe('REG02: Formulir pendaftaran menolak kiriman kosong', () => {
  test('should reject empty submission', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await expect(page.locator('input[name="name"]').getByTestId('name')).toBeVisible();
    await expect(page.locator('input[name="name"]').getByTestId('name')).toBeRequired();
    await page.fill('input[name="name"]', '');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('input[name="name"]').getByTestId('name')).toBeVisible();
    await expect(page.locator('input[name="name"]').getByTestId('name')).toBeRequired();
  });
});

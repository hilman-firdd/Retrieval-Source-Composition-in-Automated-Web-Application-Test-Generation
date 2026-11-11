const { test, expect } = require('@playwright/test');

test.describe('REG02: Formulir pendaftaran menolak kiriman kosong', () => {
  test('should reject empty form submission', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await expect(page.locator('input[name="wajib"]').getByTestId('wajib')).toBeVisible();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('input[name="wajib"]').getByTestId('wajib')).toBeVisible();
    await expect(page.locator('div.error-message')).toBeVisible();
  });
});

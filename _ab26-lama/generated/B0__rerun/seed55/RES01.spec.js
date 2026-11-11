const { test, expect } = require('@playwright/test');

test.describe('RES01: Formulir menahan masukan yang sangat panjang', () => {
  test('should be responsive and not break layout', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await expect(page.locator('input[name="nama"]').setInputValue('a'.repeat(200))).toBeVisible();
    await expect(page.locator('input[name="nama"]').locator('..')).toBeVisible();
  });
});

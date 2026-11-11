const { test, expect } = require('@playwright/test');

test.describe('REG05: Field nomor telepon menolak masukan huruf', () => {
  test('should reject input of letters', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await page.fill('input[name="telepon"]', 'abc');
    await expect(page.locator('input[name="telepon"]').nextSibling).toBeVisible();
  });
});

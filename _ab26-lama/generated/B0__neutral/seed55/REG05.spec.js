const { test, expect } = require('@playwright/test');

test.describe('REG05: Field nomor telepon menolak masukan huruf', () => {
  test('should reject input of letters', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const phoneNumberInput = page.locator('input[name="nomor_telepon"]');
    await expect(phoneNumberInput).toBeVisible();
    await phoneNumberInput.fill('abc');
    await expect(phoneNumberInput).not.toBeFocused();
    const errorIndicator = page.locator('div[name="nomor_telepon_error"]');
    await expect(errorIndicator).toBeVisible();
  });
});

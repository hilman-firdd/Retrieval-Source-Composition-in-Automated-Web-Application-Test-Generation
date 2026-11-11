const { test, expect } = require('@playwright/test');

test.describe('REG03: Formulir pendaftaran menolak format surel yang tidak sah', () => {
  test('should reject invalid email format and not navigate away', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await page.fill('input[name="email"]', 'invalidemail');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Pesan kesalahan format surel')).toBeVisible();
    await expect(page).not.toHaveURL('/pendaftaran');
  });
});

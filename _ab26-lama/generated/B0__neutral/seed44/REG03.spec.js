const { test, expect } = require('@playwright/test');

test.describe('REG03: Formulir pendaftaran menolak format surel yang tidak sah', () => {
  test('should display error message and not navigate away', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await page.fill('input[name="email"]', 'invalid email');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="Format surel tidak valid"')).toBeVisible();
    await expect(page).not.toHaveURL('/pendaftaran');
  });
});

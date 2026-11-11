const { test, expect } = require('@playwright/test');

test.describe('REG03: Formulir pendaftaran menolak format surel yang tidak sah', () => {
  test('should reject invalid email format', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await page.fill('input[name="email"]', 'invalidemail');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="Format surel tidak sah"')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});

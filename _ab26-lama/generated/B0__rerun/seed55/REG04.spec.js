const { test, expect } = require('@playwright/test');

test.describe('REG04: Mengisi seluruh field wajib pada formulir pendaftaran', () => {
  test('Mengisi seluruh field wajib', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeFocused();
    await page.fill('input[type="text"]', 'Test Name');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="phone"]', '08123456789');
    await page.fill('input[type="date"]', '2023-01-01');
    await expect(page.locator('input[type="text"]').first()).toHaveValue('Test Name');
    await expect(page.locator('input[type="email"]').first()).toHaveValue('test@example.com');
    await expect(page.locator('input[type="phone"]').first()).toHaveValue('08123456789');
    await expect(page.locator('input[type="date"]').first()).toHaveValue('2023-01-01');
    await expect(page.locator('input[type="text"]').first()).not.toBeFocused();
  });
});

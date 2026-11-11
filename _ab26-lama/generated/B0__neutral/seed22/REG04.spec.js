const { test, expect } = require('@playwright/test');

test.describe('REG04 - Mengisi seluruh field wajib pada formulir pendaftaran', () => {
  test('filling all required fields', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await expect(page.locator('input[name="nama"]')).toBeVisible();
    await page.fill('input[name="nama"]', 'Test Name');
    await expect(page.locator('input[name="nama"]')).toHaveValue('Test Name');
    await page.fill('input[name="email"]', 'test@example.com');
    await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
    await page.fill('input[name="telepon"]', '08123456789');
    await expect(page.locator('input[name="telepon"]')).toHaveValue('08123456789');
    await page.fill('input[name="alamat"]', 'Test Address');
    await expect(page.locator('input[name="alamat"]')).toHaveValue('Test Address');
    await expect(page.locator('input[name="nama"], input[name="email"], input[name="telepon"], input[name="alamat"]')).toBeVisible();
    await expect(page.locator('input[name="nama"], input[name="email"], input[name="telepon"], input[name="alamat"]')).not.toHaveClass('is-invalid');
  });
});

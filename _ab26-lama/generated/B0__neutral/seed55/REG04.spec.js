const { test, expect } = require('@playwright/test');

test.describe('REG04: Mengisi seluruh field wajib pada formulir pendaftaran', () => {
  test('fill required fields', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await expect(page.locator('input[name="nama"]')).toBeVisible();
    await page.locator('input[name="nama"]').fill('Test Name');
    await expect(page.locator('input[name="nama"]')).toHaveValue('Test Name');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await page.locator('input[name="email"]').fill('test@example.com');
    await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[name="telepon"]')).toBeVisible();
    await page.locator('input[name="telepon"]').fill('08123456789');
    await expect(page.locator('input[name="telepon"]')).toHaveValue('08123456789');
    await expect(page.locator('input[name="alamat"]')).toBeVisible();
    await page.locator('input[name="alamat"]').fill('Test Address');
    await expect(page.locator('input[name="alamat"]')).toHaveValue('Test Address');
    await expect(page.locator('input[name="kodepos"]')).toBeVisible();
    await page.locator('input[name="kodepos"]').fill('12345');
    await expect(page.locator('input[name="kodepos"]')).toHaveValue('12345');
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await page.locator('input[name="password"]').fill('Test Password');
    await expect(page.locator('input[name="password"]')).toHaveValue('Test Password');
    await expect(page.locator('input[name="konfirmasi_password"]')).toBeVisible();
    await page.locator('input[name="konfirmasi_password"]').fill('Test Password');
    await expect(page.locator('input[name="konfirmasi_password"]')).toHaveValue('Test Password');
    await expect(page.locator('button[type="submit"]')).not.toBeVisible();
  });
});

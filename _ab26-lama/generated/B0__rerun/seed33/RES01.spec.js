const { test, expect } = require('@playwright/test');

test.describe('RES01: Formulir menahan masukan yang sangat panjang', () => {
  test('should be responsive and functional', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await expect(page.locator('input[name="nama"]').getByPlaceholder('Nama')).toBeVisible();
    await page.locator('input[name="nama"]').fill('a'.repeat(200));
    await expect(page.locator('input[name="nama"]').getByPlaceholder('Nama')).toBeVisible();
    await expect(page.locator('input[name="nama"]').getByPlaceholder('Nama')).toHaveValue('a'.repeat(200));
  });
});

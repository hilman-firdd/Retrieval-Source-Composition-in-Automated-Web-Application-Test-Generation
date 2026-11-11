const { test, expect } = require('@playwright/test');

test.describe('RES01: Formulir menahan masukan yang sangat panjang', () => {
  test('should remain responsive and layout intact', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const namaField = page.locator('input[name="nama"]');
    await expect(namaField).toBeVisible();
    await namaField.fill('a'.repeat(200));
    await expect(page.locator('body')).toBeVisible();
  });
});

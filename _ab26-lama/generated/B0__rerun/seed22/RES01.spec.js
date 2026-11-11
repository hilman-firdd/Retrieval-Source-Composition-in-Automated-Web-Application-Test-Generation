const { test, expect } = require('@playwright/test');

test.describe('RES01: Formulir menahan masukan yang sangat panjang', () => {
  test('should not break the layout', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await page.fill('input[name="nama"]', 'a'.repeat(200));
    await expect(page.locator('input[name="nama"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

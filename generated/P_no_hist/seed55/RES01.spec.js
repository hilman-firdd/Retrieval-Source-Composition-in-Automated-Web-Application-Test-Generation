const { test, expect } = require('@playwright/test');

test.describe('RES01 - Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('should not break the layout', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[name="q"]', 'a'.repeat(200));
    await page.keyboard.press('Enter');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h3')).toBeVisible();
  });
});

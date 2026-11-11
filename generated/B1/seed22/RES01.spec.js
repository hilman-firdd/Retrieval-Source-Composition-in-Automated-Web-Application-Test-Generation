const { test, expect } = require('@playwright/test');

test.describe('RES01: Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('should not break the layout', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[name="q"]', 'a'.repeat(200));
    await page.press('input[name="q"]', 'Enter');
    await expect(page.locator('input[name="q"]')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });
});

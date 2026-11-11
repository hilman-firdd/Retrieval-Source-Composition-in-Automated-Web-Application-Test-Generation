const { test, expect } = require('@playwright/test');

test.describe('RES01: Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('Search with very long input', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[name="q"]', 'a'.repeat(201));
    await page.keyboard.press('Enter');
    await expect(page.locator('input[name="q"]').nth(1)).toBeVisible();
    await expect(page.locator('body')).not.toHaveClass('error');
  });
});

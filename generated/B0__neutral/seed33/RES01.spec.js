const { test, expect } = require('@playwright/test');

test.describe('RES01: Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('should not break the layout', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const searchInput = page.locator('input[name="q"]');
    await searchInput.fill('a'.repeat(200));
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('main')).not.toHaveClass('error');
  });
});

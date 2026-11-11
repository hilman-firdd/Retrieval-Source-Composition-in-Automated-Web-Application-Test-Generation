const { test, expect } = require('@playwright/test');

test.describe('RES01: Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('should not break the layout', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[type="search"]', 'a'.repeat(201));
    await page.keyboard.press('Enter');
    await expect(page.locator('input[type="search"]').getByTestId('search-input')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/berita');
  });
});

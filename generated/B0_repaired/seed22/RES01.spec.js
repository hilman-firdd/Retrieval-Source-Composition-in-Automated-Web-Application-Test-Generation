const { test, expect } = require('@playwright/test');

test.describe('RES01: Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('Search with very long input', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const searchInput = page.locator('input[data-test-id="search-input"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('a'.repeat(200));
    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toHaveClass('error');
  });
});

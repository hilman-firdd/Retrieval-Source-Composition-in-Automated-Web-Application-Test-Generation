const { test, expect } = require('@playwright/test');

test.describe('INF04: Pencarian dengan kata kunci yang tidak ada hasilnya', () => {
  test('Search with non-existent keyword', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await page.fill('input[name="q"]', 'random keyword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });
});

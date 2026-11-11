const { test, expect } = require('@playwright/test');

test.describe('ARTC04: Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Search article with non-existent keyword', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await page.fill('input[name="q"]', 'random keyword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });
});

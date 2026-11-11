const { test, expect } = require('@playwright/test');

test.describe('NEWS06: Pencarian berita dengan kata kunci yang tidak ada hasilnya', () => {
  test('Search result with no results', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[name="q"]', 'random keyword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="(0 hasil)"')).toBeVisible();
    await expect(page.locator('text="Tidak ada berita ditemukan"')).toBeVisible();
  });
});

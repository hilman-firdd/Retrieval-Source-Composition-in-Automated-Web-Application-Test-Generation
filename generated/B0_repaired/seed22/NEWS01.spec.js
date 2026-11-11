const { test, expect } = require('@playwright/test');

test.describe('NEWS01 - Membuka daftar berita dan memverifikasi ada item', () => {
  test('Verify news list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsListTitle = page.locator('h3:has-text("Berita Terbaru")');
    await expect(newsListTitle).toBeVisible();
    const newsItems = page.locator('h3:has-text("Berita Terbaru")').nextAll();
    await expect(newsItems).toBeVisible();
    await expect(newsItems).not.toHaveCount(0);
  });
});

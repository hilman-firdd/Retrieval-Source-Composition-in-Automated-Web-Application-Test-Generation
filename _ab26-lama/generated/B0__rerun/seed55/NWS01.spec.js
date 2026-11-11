const { test, expect } = require('@playwright/test');

test.describe('NWS01 - Membuka daftar berita dan memverifikasi ada item', () => {
  test('Membuka daftar berita dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    const newsList = page.locator('div[data-test-id="news-list"]');
    await expect(newsList).toBeVisible();
    const newsItems = newsList.locator('li');
    await expect(newsItems).toBeVisible();
    await expect(newsItems).toHaveLength(greaterThan(0));
  });
});

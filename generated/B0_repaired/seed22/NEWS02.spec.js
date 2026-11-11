const { test, expect } = require('@playwright/test');

test.describe('NEWS02: Membuka detail berita dari daftar', () => {
  test('Membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsList = await page.locator('ul.news-list');
    const firstNews = await newsList.locator('h2[data-test-id="news-title"]');
    await firstNews.click();
    await expect(page).toHaveURL(/portal\/[a-zA-Z0-9-]+/);
    await expect(page.locator('h1')).toBeVisible();
  });
});

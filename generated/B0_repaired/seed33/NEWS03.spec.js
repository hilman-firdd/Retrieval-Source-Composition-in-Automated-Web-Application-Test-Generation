const { test, expect } = require('@playwright/test');

test.describe('NEWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsList = await page.locator('ul.news-list');
    const newsItems = await newsList.locator('li');
    const firstNews = await newsItems.first();
    const newsTitle = await firstNews.locator('h2').textContent();
    await firstNews.click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/berita/*');
    const detailPageTitle = await page.locator('h1').textContent();
    await expect(page.locator('h1')).toBeVisible();
    expect(newsTitle).toBe(detailPageTitle);
  });
});

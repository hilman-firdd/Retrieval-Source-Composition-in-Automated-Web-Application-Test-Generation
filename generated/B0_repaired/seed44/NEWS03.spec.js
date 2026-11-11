const { test, expect } = require('@playwright/test');

test.describe('NEWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsList = await page.locator('ul.news-list');
    const newsItems = await newsList.locator('li.news-item');
    const newsTitle = await newsItems.first().locator('h2.news-title').textContent();
    await newsItems.first().locator('h2.news-title').click();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita/' + newsTitle);
    const detailPageTitle = await page.locator('h1').textContent();
    expect(newsTitle).toBe(detailPageTitle);
    await expect(page.locator('h1')).toBeVisible();
  });
});

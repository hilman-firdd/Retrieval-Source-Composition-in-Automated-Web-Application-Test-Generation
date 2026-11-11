const { test, expect } = require('@playwright/test');

test.describe('NEWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsList = await page.locator('ul.news-list').first();
    const newsTitle = await newsList.locator('li.news-item').getByTestId('news-title').textContent();
    await newsList.locator('li.news-item').getByTestId('news-title').click();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita/' + newsTitle);
    const detailPageTitle = await page.locator('h1').textContent();
    expect(newsTitle).toBe(detailPageTitle);
  });
});

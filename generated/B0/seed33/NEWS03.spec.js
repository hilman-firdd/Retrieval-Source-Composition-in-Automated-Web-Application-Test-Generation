const { test, expect } = require('@playwright/test');

test.describe('NEWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsList = await page.locator('ul.news-list').getByRole('listitem');
    const firstNews = await newsList.first();
    const newsTitle = await firstNews.locator('h2').getByTestId('news-title').textContent();
    await firstNews.click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/berita/*');
    const detailPageTitle = await page.locator('h1').getByTestId('news-title').textContent();
    expect(newsTitle).toBe(detailPageTitle);
  });
});

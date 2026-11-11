const { test, expect } = require('@playwright/test');

test.describe('NEWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsList = await page.locator('ul.news-list');
    const newsTitle = await newsList.locator('li').first().locator('h2').textContent();
    await newsList.locator('li').first().locator('a').click();
    await page.locator('h1').waitForVisible();
    const detailTitle = await page.locator('h1').textContent();
    expect(detailTitle).toBe(newsTitle);
  });
});

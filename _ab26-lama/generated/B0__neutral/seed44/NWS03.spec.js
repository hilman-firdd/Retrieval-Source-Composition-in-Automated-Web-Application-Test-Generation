const { test, expect } = require('@playwright/test');

test.describe('NWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    const newsList = page.locator('ul.news-list');
    const firstNewsTitle = newsList.locator('li:first-child a').textContent();
    await page.click(`ul.news-list li:first-child a`);
    const detailPage = page.locator('main.detail-page');
    const detailTitle = detailPage.locator('h1.title').textContent();
    expect(detailTitle).toBe(firstNewsTitle);
  });
});

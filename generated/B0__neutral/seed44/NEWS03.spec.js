const { test, expect } = require('@playwright/test');

test.describe('NEWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsList = page.locator('ul.news-list');
    const firstNewsTitle = newsList.locator('li:first-child a').textContent();
    await page.click(`ul.news-list li:first-child a`);
    const detailPage = page.locator('main');
    const detailTitle = detailPage.locator('h1').textContent();
    expect(firstNewsTitle).toBe(detailTitle);
  });
});

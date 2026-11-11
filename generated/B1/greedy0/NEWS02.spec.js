const { test, expect } = require('@playwright/test');

test.describe('NEWS02 - Membuka detail berita dari daftar', () => {
  test('Membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');

    // Find the first news title and click it
    const newsTitle = await page.$('a[data-test="news-title"]');
    await newsTitle.click();

    // Assert the URL has changed to the news detail page
    expect(await page.url()).toBe('https://staging.pesantrenpersis27.com/portal/<slug-berita>');

    // Assert the news title is visible on the detail page
    const newsTitleDetail = await page.$('h1');
    expect(await newsTitleDetail.textContent()).toBe('Berita Terbaru - Portal Pesantren PERSIS 27');
  });
});

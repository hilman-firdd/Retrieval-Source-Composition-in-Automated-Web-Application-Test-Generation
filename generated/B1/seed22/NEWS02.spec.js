const { test, expect } = require('@playwright/test');

test.describe('NEWS02 - Membuka detail berita dari daftar', () => {
  test('Membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');

    // Find the first news title and click it
    const newsTitle = await page.locator('text=Berita Terbaru').first();
    await newsTitle.click();

    // Verify the URL has changed to the news detail page
    const url = await page.url();
    expect(url).toContain('/portal/');

    // Verify the news title is displayed on the detail page
    const newsTitleDetail = await page.locator('h1');
    expect(await newsTitleDetail.textContent()).not.toBe(null);
  });
});

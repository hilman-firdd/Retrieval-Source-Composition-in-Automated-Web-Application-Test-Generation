const { test, expect } = require('@playwright/test');

test.describe('NEWS03', () => {
  test('Judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsTitle = await page.locator('text=Judul berita').first();
    await newsTitle.click();
    await page.waitForSelector('h1');
    const detailTitle = await page.locator('h1').textContent();
    expect(detailTitle).toBe(newsTitle.textContent());
  });
});

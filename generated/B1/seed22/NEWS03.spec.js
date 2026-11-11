const { test, expect } = require('@playwright/test');

test.describe('NEWS03 - Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.waitForSelector('h1');
    const newsTitleList = await page.$$('.news-title');
    const newsTitleDetail = await page.$('h1');
    const newsTitleListText = await newsTitleList.map((element) => element.textContent);
    const newsTitleDetailText = await newsTitleDetail.textContent;
    expect(newsTitleListText[0]).toBe(newsTitleDetailText);
  });
});

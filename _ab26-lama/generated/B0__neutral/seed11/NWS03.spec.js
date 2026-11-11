const { test, expect } = require('@playwright/test');

test.describe('NWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    const beritaList = page.locator('ul.berita-list');
    const firstBeritaTitle = beritaList.locator('li:first-child a').textContent();
    await beritaList.locator('li:first-child a').click();
    await page.goto('https://staging.pesantrenpersis27.com/berita/' + firstBeritaTitle);
    const detailBeritaTitle = page.locator('h1.title').textContent();
    expect(firstBeritaTitle).toBe(detailBeritaTitle);
  });
});

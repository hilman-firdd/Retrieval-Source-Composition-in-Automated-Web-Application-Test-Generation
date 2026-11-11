const { test, expect } = require('@playwright/test');

test.describe('NEWS03 - Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify judul berita on daftar and detail page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const beritaList = await page.$$('.news-list-item');
    const firstBerita = beritaList[0];
    await firstBerita.click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/*');
    const detailPageTitle = await page.getByRole('heading', { name: 'h1' }).textContent;
    const daftarPageTitle = await firstBerita.$('h3').textContent;
    expect(daftarPageTitle).toBe(detailPageTitle);
  });
});

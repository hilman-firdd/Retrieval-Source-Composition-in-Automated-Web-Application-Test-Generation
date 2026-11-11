const { test, expect } = require('@playwright/test');

test.describe('NWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    const firstArticleTitle = await page.locator('text=Judul Berita Pertama').getByText();
    await page.click(firstArticleTitle);
    const detailPageTitle = await page.locator('text=Judul Berita Pertama').getByText();
    expect(firstArticleTitle).toBe(detailPageTitle);
  });
});

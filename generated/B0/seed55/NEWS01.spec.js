const { test, expect } = require('@playwright/test');

test.describe('NEWS01: Membuka daftar berita dan memverifikasi ada item', () => {
  test('Membuka halaman berita dan memverifikasi judul "Berita Terbaru" terlihat', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const beritaTerbaru = page.locator('h3:has-text("Berita Terbaru")');
    await expect(beritaTerbaru).toBeVisible();
    const newsList = page.locator('ul.news-list');
    await expect(newsList).toBeVisible();
    await expect(newsList).toHaveMoreThan(0)('items');
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NEWS01: Membuka daftar berita dan memverifikasi ada item', () => {
  test('Membuka halaman berita dan verifikasi judul "Berita Terbaru" terlihat', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const beritaTerbaruLocator = page.locator('h3:has-text("Berita Terbaru")');
    await expect(beritaTerbaruLocator).toBeVisible();
  });

  test('Membuka halaman berita dan verifikasi ada item berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsListLocator = page.locator('ul');
    await expect(newsListLocator).toBeVisible();
    const newsItemsLocator = newsListLocator.locator('li');
    await expect(newsItemsLocator).toBeVisible();
    await expect(newsItemsLocator).not.toHaveCount(0);
  });
});

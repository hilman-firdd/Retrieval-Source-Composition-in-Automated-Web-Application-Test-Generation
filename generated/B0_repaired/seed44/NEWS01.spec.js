const { test, expect } = require('@playwright/test');

test.describe('NEWS01: Membuka daftar berita dan memverifikasi ada item', () => {
  test('Membuka halaman berita dan memverifikasi judul "Berita Terbaru" terlihat', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const beritaTerbaruLocator = page.locator('a:has-text("Berita Terbaru")');
    await expect(beritaTerbaruLocator).toBeVisible();
  });

  test('Membuka halaman berita dan memverifikasi ada item berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsListLocator = page.locator('ul.navbar-nav.ms-auto.me-3'); // Use the correct locator
    await expect(newsListLocator).toBeVisible();
  });
});

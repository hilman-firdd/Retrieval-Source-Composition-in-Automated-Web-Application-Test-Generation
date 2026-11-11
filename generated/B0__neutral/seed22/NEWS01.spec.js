const { test, expect } = require('@playwright/test');

test.describe('NEWS01 - Membuka daftar berita dan memverifikasi ada item', () => {
  test('Membuka halaman berita dan memverifikasi judul dan jumlah item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h3:contains("Berita Terbaru")')).toBeVisible();
    await expect(page.locator('ul > li')).toBeVisible();
  });
});

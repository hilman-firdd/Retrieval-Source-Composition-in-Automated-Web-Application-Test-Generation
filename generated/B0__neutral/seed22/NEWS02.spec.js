const { test, expect } = require('@playwright/test');

test.describe('NEWS02: Membuka detail berita dari daftar', () => {
  test('Membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const beritaList = page.locator('ul.berita-list');
    await expect(beritaList).toBeVisible();
    const firstBerita = beritaList.locator('li:first-child');
    await expect(firstBerita).toBeVisible();
    await firstBerita.click();
    await expect(page).toHaveURL(/portal\/[a-zA-Z0-9-]+/);
    const beritaDetail = page.locator('h1.berita-judul');
    await expect(beritaDetail).toBeVisible();
  });
});

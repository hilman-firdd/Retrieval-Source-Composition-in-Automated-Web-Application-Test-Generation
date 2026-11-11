const { test, expect } = require('@playwright/test');

test.describe('ARTC01: Membuka daftar artikel dan memverifikasi ada item', () => {
  test('Membuka daftar artikel dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    const articleTitle = page.locator('h3[role="heading"][data-test="artikel-tulisan-santri"]');
    await expect(articleTitle).toBeVisible();
    await expect(articleTitle).toHaveText('Artikel Tulisan Santri');
    await expect(page.locator('ul.artikel-list')).toHaveMoreThan(0, 'items');
  });
});

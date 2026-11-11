const { test, expect } = require('@playwright/test');

test.describe('ARTC01: Membuka daftar artikel dan memverifikasi ada item', () => {
  test('Membuka daftar artikel dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    const articleTitle = await page.locator('h3[role="heading"][name="Artikel Tulisan Santri"]').first();
    await expect(articleTitle).toBeVisible();
    await expect(articleTitle).hasText('Artikel Tulisan Santri');
    const articleList = await page.locator('h3[role="heading"]').nextAll();
    await expect(articleList).toBeVisible();
    await expect(articleList).not.toHaveCount(0);
  });
});

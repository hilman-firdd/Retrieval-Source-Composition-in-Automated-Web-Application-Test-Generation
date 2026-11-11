const { test, expect } = require('@playwright/test');

test.describe('ARTC01 - Membuka daftar artikel dan memverifikasi ada item', () => {
  test('Membuka daftar artikel dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('h3:has-text("Artikel Tulisan Santri")')).toBeVisible();
    await expect(page.locator('h3:has-text("Artikel Tulisan Santri")')).not.toBeHidden();
    const articleList = await page.locator('ul.artikel-list');
    await expect(articleList).toBeVisible();
    await expect(articleList).not.toBeHidden();
    const articleItems = await articleList.all('li');
    await expect(articleItems).toHaveLength(greaterThan(0));
  });
});

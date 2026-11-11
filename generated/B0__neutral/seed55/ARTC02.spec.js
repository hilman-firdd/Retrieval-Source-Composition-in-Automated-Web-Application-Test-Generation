const { test, expect } = require('@playwright/test');

test.describe('ARTC02: Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    const articleList = page.locator('ul.artikel-list');
    await expect(articleList).toBeVisible();
    const firstArticle = articleList.first();
    await firstArticle.click();
    await expect(page).toHaveURL(/\/portal\/[a-zA-Z0-9-]+/);
    const articleTitle = page.locator('h1.artikel-title');
    await expect(articleTitle).toBeVisible();
  });
});

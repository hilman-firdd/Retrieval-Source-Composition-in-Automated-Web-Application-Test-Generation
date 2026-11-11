const { test, expect } = require('@playwright/test');

test.describe('NEWS01 - Membuka daftar berita dan memverifikasi ada item', () => {
  test('Verify news list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h3')).toBeVisible();
    await expect(page.locator('h3')).toContainText('Berita Terbaru');
    const newsList = await page.locator('ul.news-list');
    await expect(newsList).toBeVisible();
    await expect(newsList).toHaveAtLeastOneChild();
  });
});

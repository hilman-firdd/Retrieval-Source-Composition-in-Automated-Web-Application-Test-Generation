const { test, expect } = require('@playwright/test');

test.describe('ARTC03: Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Menggunakan navigasi halaman pada daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel?page=1');
    await expect(page.locator('div[data-test-id="article-list"]').first()).toBeVisible();
    await page.locator('a:has-text("2")').click();
    await expect(page.locator('div[data-test-id="article-list"]').first()).not.toBeVisible();
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel?page=2');
    await expect(page.locator('div[data-test-id="article-list"]').first()).toBeVisible();
    const firstArticleTitle = await page.locator('h2:has-text("Jihad Adalah Amalan Paling Utama—Basharidlo Thoriq Bintoro")').textContent();
    await expect(firstArticleTitle).not.toEqual(await page.locator('h2:has-text("First Article Title")').textContent());
  });
});

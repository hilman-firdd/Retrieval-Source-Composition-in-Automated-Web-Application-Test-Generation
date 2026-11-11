const { test, expect } = require('@playwright/test');

test.describe('ARTC03: Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Menggunakan navigasi halaman pada daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel?page=1');
    await expect(page.locator('div[data-test-id="article-list"]').first()).toBeVisible();
    await page.locator('a:has-text("2")').click();
    await expect(page.locator('div[data-test-id="article-list"]').nth(1)).toBeVisible();
    const articleTitle = await expect(page.locator('a:has-text("Jihad Adalah Amalan Paling Utama—Basharidlo Thoriq Bintoro")')).toBeVisible();
    await expect(articleTitle).not.toHaveText('Article 1');
  });
});

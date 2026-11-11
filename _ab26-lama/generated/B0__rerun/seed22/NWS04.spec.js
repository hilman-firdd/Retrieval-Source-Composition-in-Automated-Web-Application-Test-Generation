const { test, expect } = require('@playwright/test');

test.describe('NWS04: Menggunakan navigasi halaman pada daftar berita', () => {
  test('Verify second page and news item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
    await page.locator('button:has-text("Next")').click();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
    const secondPageNewsItem = await page.locator('ul li:has-text("Berita")').first();
    await expect(secondPageNewsItem).toBeVisible();
    const firstPageNewsItem = await page.locator('ul li:has-text("Berita")').nth(0);
    await expect(firstPageNewsItem).not.toBeVisible();
  });
});

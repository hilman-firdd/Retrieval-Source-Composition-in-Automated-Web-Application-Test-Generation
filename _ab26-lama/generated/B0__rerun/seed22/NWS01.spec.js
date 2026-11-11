const { test, expect } = require('@playwright/test');

test.describe('NWS01 - Membuka daftar berita dan memverifikasi ada item', () => {
  test('Membuka daftar berita dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    await expect(page.locator('div[data-test-id="news-list"]').toBeVisible());
    await expect(page.locator('div[data-test-id="news-list"] li').count()).toBeGreaterThan(0);
  });
});

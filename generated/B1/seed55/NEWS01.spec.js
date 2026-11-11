const { test, expect } = require('@playwright/test');

test.describe('NEWS01: Membuka daftar berita dan memverifikasi ada item', () => {
  test('Verify news list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h3')).toBeVisible();
    await expect(page.locator('h3')).toHaveText('Berita Terbaru');
    await expect(page.locator('ul > li')).toBeVisible();
    await expect(page.locator('ul > li')).toHaveCount(greaterThan(0));
  });
});

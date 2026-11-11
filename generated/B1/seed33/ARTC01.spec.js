const { test, expect } = require('@playwright/test');

test.describe('ARTC01: Membuka daftar artikel dan memverifikasi ada item', () => {
  test('Membuka halaman artikel dan memverifikasi judul dan jumlah item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('h3')).toBeVisible();
    await expect(page.locator('h3')).toContainText('Artikel Tulisan Santri');
    await expect(page.locator('ul > li')).toBeVisible();
    await expect(page.locator('ul > li')).toHaveCount(greaterThan(0));
  });
});

const { test, expect } = require('@playwright/test');

test.describe('ARTC01 - Membuka daftar artikel dan memverifikasi ada item', () => {
  test('Membuka daftar artikel dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.getByText('Artikel Tulisan Santri')).toBeVisible();
    await expect(page.locator('h3')).toBeVisible();
  });
});

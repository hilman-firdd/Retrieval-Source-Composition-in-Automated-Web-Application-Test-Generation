const { test, expect } = require('@playwright/test');

test.describe('NWS01 - Membuka daftar berita dan memverifikasi ada item', () => {
  test('Membuka daftar berita dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    await expect(page.locator('text=Berita')).toBeVisible();
    await expect(page.locator('text=Berita')).hasText('Berita');
    await expect(page.locator('text=Berita')).hasCountGreaterThan(0);
  });
});

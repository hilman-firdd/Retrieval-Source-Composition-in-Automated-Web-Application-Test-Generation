const { test, expect } = require('@playwright/test');

test.describe('NWS02: Membuka detail berita dari daftar', () => {
  test('Membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    await expect(page.locator('text=Berita 1')).click();
    await expect(page.locator('text=Berita 1')).toBeVisible();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/berita/berita-1');
    await expect(page.locator('h1:has-text("Berita 1")')).toBeVisible();
    await expect(page.locator('text:has-word("Berita 1")')).toBeVisible();
  });
});

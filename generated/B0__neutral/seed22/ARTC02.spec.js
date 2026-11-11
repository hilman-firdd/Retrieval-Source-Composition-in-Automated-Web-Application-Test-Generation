const { test, expect } = require('@playwright/test');

test.describe('ARTC02: Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('text="Artikel"')).toBeVisible();
    await page.click('text="Artikel 1"');
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/portal/<slug-artikel>');
    await expect(page.locator('text="Judul Artikel"')).toBeVisible();
  });
});

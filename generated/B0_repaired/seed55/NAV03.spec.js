const { test, expect } = require('@playwright/test');

test.describe('NAV03: Berpindah dari beranda ke daftar artikel santri', () => {
  test('Navigation to article list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('text="Lihat Semua"')).toBeVisible();
    await page.locator('text="Lihat Semua"').click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('h1:has-text("Artikel Tulisan Santri")')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NAV02: Berpindah dari beranda ke daftar berita', () => {
  test('Navigation to Berita Terbaru', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('text="Semua Berita"')).toBeVisible();
    await page.locator('text="Semua Berita"').click();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('text="Berita Terbaru"')).toBeVisible();
  });
});

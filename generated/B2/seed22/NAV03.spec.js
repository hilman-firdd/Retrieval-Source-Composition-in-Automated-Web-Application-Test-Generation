const { test, expect } = require('@playwright/test');

test.describe('NAV03: Berpindah dari beranda ke daftar artikel santri', () => {
  test('Berpindah dari beranda ke daftar artikel santri', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    // Click on the "Lihat Semua" button
    await page.locator('text="Lihat Semua"').click();

    // Assert the URL has changed to /portal/artikel
    await expect(page).toHaveUrl('https://staging.pesantrenpersis27.com/portal/artikel');

    // Assert the title 'Artikel Tulisan Santri' is visible
    await expect(page.locator('text="Artikel Santri - Portal Pesantren PERSIS 27"')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NAV03 - Berpindah dari beranda ke daftar artikel santri', () => {
  test('should navigate from home to article list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    // Click on 'Lihat Semua' link
    const lihatSemuaLink = page.getByRole('link', { name: 'Lihat Semua' });
    await lihatSemuaLink.click();

    // Assert URL has changed to /portal/artikel
    await expect(page).toHaveUrl('https://staging.pesantrenpersis27.com/portal/artikel');

    // Assert 'Artikel Tulisan Santri' title is visible
    const artikelTulisanSantriTitle = page.getByText('Artikel Tulisan Santri');
    await expect(arikelTulisanSantriTitle).toBeVisible();
  });
});

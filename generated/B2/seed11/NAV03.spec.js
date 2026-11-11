const { test, expect } = require('@playwright/test');

test.describe('NAV03 - Berpindah dari beranda ke daftar artikel santri', () => {
  test('should navigate from home to portal-artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');

    // Click on 'Lihat Semua' button
    const lihatSemuaButton = page.getByRole('link', { name: 'Lihat Semua' });
    await expect(lihatSemuaButton).toBeVisible();
    await lihatSemuaButton.click();

    // Verify URL and title
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.getByText('Artikel Tulisan Santri')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NAV03 - Berpindah dari beranda ke daftar artikel santri', () => {
  test('Berpindah dari beranda ke daftar artikel santri', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.getByRole('link', { name: 'Pesantren Persis 27 Situaksan Bandung Gelar Agenda Wisata "Goes to Pangandaran"' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lihat Semua' })).toBeVisible();
    await page.click('text=Lihat Semua');
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.getByText('Artikel Tulisan Santri')).toBeVisible();
  });
});

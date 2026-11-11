const { test, expect } = require('@playwright/test');

test.describe('NAV03 - Berpindah dari beranda ke daftar artikel santri', () => {
  test('Berpindah dari beranda ke daftar artikel santri', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('a', { name: 'Pesantren Persis 27 Situaksan Bandung Gelar Agenda Wisata "Goes to Pangandaran"' })).toBeVisible();
    await expect(page.locator('a', { name: 'KTI KTI SANTRI PPI 27 Karya Tulis Ilmiah Koleksi karya tulis ilmiah yang disusun oleh para santri PPI 27. Buka Sarana' })).toBeVisible();
    await expect(page.locator('a', { name: 'PELEPASAN SANTRI PDKS Tahun 2026' })).toBeVisible();
    await page.locator('a', { name: 'Lihat Semua' }).click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('h2', { text: 'Artikel Tulisan Santri' })).toBeVisible();
  });
});

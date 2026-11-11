const { test, expect } = require('@playwright/test');

test.describe('Menu navigasi konsisten di seluruh halaman portal', () => {
  test('Menu navigasi konsisten di seluruh halaman portal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PELEPASAN SANTRI PDKS Tahun 2026' })).toBeVisible();
  });
});

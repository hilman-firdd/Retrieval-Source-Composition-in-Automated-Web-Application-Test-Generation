const { test, expect } = require('@playwright/test');

test.describe('NAV04 - Menu navigasi konsisten di seluruh halaman portal', () => {
  test('Menu navigasi konsisten di beranda', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/');
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lihat Semua' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PELEPASAN SANTRI PDKS Tahun 2026' })).toBeVisible();
  });

  test('Menu navigasi konsisten di daftar berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lihat Semua' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PELEPASAN SANTRI PDKS Tahun 2026' })).toBeVisible();
  });

  test('Menu navigasi konsisten di daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lihat Semua' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'PELEPASAN SANTRI PDKS Tahun 2026' })).toBeVisible();
  });
});

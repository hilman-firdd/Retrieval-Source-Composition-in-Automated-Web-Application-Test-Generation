const { test, expect } = require('@playwright/test');

test.describe('NAV01: Membuka beranda dan memverifikasi identitas situs', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');

    await expect(page.getByText('Berita Terbaru - Portal Pesantren PERSIS 27')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await expect(page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S')).toBeVisible();
  });
});

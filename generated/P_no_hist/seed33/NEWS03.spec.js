const { test, expect } = require('@playwright/test');

test.describe('NEWS03 - Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await page.click(`h3:has-text("PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S")`);
    await expect(page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S')).toBeVisible();
    await expect(page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S')).toBeVisible();
  });
});

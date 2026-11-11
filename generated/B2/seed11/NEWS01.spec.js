const { test, expect } = require('@playwright/test');

test.describe('NEWS01 - Membuka daftar berita dan memverifikasi ada item', () => {
  test('Membuka daftar berita dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S')).toBeVisible();
  });
});

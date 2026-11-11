const { test, expect } = require('@playwright/test');

test.describe('NEWS01 - Membuka daftar berita dan memverifikasi ada item', () => {
  test('Membuka daftar berita dan memverifikasi ada item', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S')).toBeVisible();
    await expect(page.getByText('PELEPASAN SANTRI PDKS Tahun 2026')).toBeVisible();
    await expect(page.getByText('SILATURAHMI ORANG TUA SANTRI BARU TA. 2026-2027')).toBeVisible();
    await expect(page.getByText('Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta\'aruf dan Silaturahmi Orang Tua Santri')).toBeVisible();
    await expect(page.locator('h3')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NEWS04 - Menggunakan navigasi halaman pada daftar berita', () => {
  test('Menggunakan navigasi halaman pada daftar berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page.getByText('Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta\'aruf dan Silaturahmi Orang Tua Santri')).toBeVisible();
    await page.locator('a:has-text("Pelepasan Santri Jenjang Ibtidaiyah, Tsanawiyah, dan Mu\'allimin Tahun 2026 Berlangsung Khidmat")').click();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita?page=2');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NEWS04 - Menggunakan navigasi halaman pada daftar berita', () => {
  test('Navigasi halaman pada daftar berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page.getByText('Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta\'aruf dan Silaturahmi Orang Tua Santri')).toBeVisible();
    await expect(page.getByText('Pelepasan Santri Jenjang Ibtidaiyah, Tsanawiyah, dan Mu\'allimin Tahun 2026 Berlangsung Khidmat')).toBeVisible();
    await expect(page.getByText('Pesantren Persis 27 Situaksan Bandung Gelar Agenda Wisata "Goes to Pangandaran"')).toBeVisible();
    await expect(page.getByText('SELAMAT HARI RAYA IDUL ADHA 1447 H')).toBeVisible();
    await expect(page.getByText('Selamat Bertugas; Pembimbing Jama\'ah Haji PERSIS Kota Bandung')).toBeVisible();
    await expect(page.getByText('JIHAD ISTIMEWA & PELEPASAN JAMA\'AH HAJI 2026')).toBeVisible();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita?page=2');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S')).toBeVisible();
    await expect(page.getByText('PELEPASAN SANTRI PDKS Tahun 2026')).toBeVisible();
    await expect(page.getByText('SILATURAHMI ORANG TUA SANTRI BARU TA. 2026-2027')).toBeVisible();
    await expect(page.getByText('Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta\'aruf dan Silaturahmi Orang Tua Santri')).toBeVisible();
    await expect(page.getByText('Selamat Bertugas; Pembimbing Jama\'ah Haji PERSIS Kota Bandung')).toBeVisible();
    await expect(page.getByText('JIHAD ISTIMEWA & PELEPASAN JAMA\'AH HAJI 2026')).toBeVisible();
  });
});

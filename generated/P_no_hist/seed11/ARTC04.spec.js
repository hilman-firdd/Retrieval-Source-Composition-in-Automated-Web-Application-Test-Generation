const { test, expect } = require('@playwright/test');

test.describe('ARTC04 - Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await page.locator('input[name="search"]').fill('kata kunci acak yang tidak ada');
    await page.locator('input[name="search"]').dispatchEvent(new Event('input', { bubbles: true }));
    await expect(page.locator('h2:has-text("Artikel Tulisan Santri")')).toBeVisible();
    await expect(page.locator('h3:has-text("11. Apakah wali dapat memantau kehadiran anaknya?")')).toBeVisible();
    await expect(page.locator('h3:has-text("12. Bagaimana jika anak tidak masuk karena sakit atau izin?")')).toBeVisible();
    await expect(page.locator('h2:has-text("Keuangan")')).toBeVisible();
    await expect(page.locator('h3:has-text("13. Dapatkah wali melihat tagihan dan riwayat pembayaran?")')).toBeVisible();
    await expect(page.locator('h3:has-text("14. Bagaimana cara pembayaran SPP?")')).toBeVisible();
    await expect(page.locator('h3:has-text("15. Saya sudah bayar tapi tagihan masih aktif, kenapa?")')).toBeVisible();
    await expect(page.locator('h2:has-text("Teknis")')).toBeVisible();
    await expect(page.locator('h1:has-text("Berita Terbaru")')).toBeVisible();
    await expect(page.locator('h3:has-text("PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S")')).toBeVisible();
    await expect(page.locator('h3:has-text("PELEPASAN SANTRI PDKS Tahun 2026")')).toBeVisible();
    await expect(page.locator('h3:has-text("SILATURAHMI ORANG TUA SANTRI BARU TA. 2026-2027")')).toBeVisible();
    await expect(page.locator('h3:has-text("Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta\'aruf dan Silaturahmi Orang Tua Santri")')).toBeVisible();
    await expect(page.locator('h3:has-text("Pelepasan Santri Jenjang Ibtidaiyah, Tsanawiyah, dan Mu\'allimin Tahun 2026 Berlangsung Khidmat")')).toBeVisible();
    await expect(page.locator('h1:has-text("Artikel Santri - Portal Pesantren PERSIS 27")')).toBeVisible();
    await expect(page.locator('h2:has-text("Presensi & Kegiatan")')).toBeVisible();
    await expect(page.locator('h3:has-text("11. Apakah wali dapat memantau kehadiran anaknya?")')).toBeVisible();
    await expect(page.locator('h3:has-text("12. Bagaimana jika anak tidak masuk karena sakit atau izin?")')).toBeVisible();
    await expect(page.locator('h2:has-text("Keuangan")')).toBeVisible();
    await expect(page.locator('h3:has-text("13. Dapatkah wali melihat tagihan dan riwayat pembayaran?")')).toBeVisible();
    await expect(page.locator('h3:has-text("14. Bagaimana cara pembayaran SPP?")')).toBeVisible();
    await expect(page.locator('h3:has-text("15. Saya sudah bayar tapi tagihan masih aktif, kenapa?")')).toBeVisible();
    await expect(page.locator('h2:has-text("Teknis")')).toBeVisible();
    await expect(page.locator('h1:has-text("Berita Terbaru")')).toBeVisible();
    await expect(page.locator('h3:has-text("PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S")')).toBeVisible();
    await expect(page.locator('h3:has-text("PELEPASAN SANTRI PDKS Tahun 2026")')).toBeVisible();
    await expect(page.locator('h3:has-text("SILATURAHMI ORANG TUA SANTRI BARU TA. 2026-2027")')).toBeVisible();
    await expect(page.locator('h3:has-text("Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta\'aruf dan Silaturahmi Orang Tua Santri")')).toBeVisible();
    await expect(page.locator('h3:has-text("Pelepasan Santri Jenjang Ibtidaiyah, Tsanawiyah, dan Mu\'allimin Tahun 2026 Berlangsung Khidmat")')).toBeVisible();
    await expect(page.locator('h1:has-text("Artikel Santri - Portal Pesantren PERSIS 27")')).toBeVisible();
    await expect(page.locator('h2:has-text("Presensi & Kegiatan")')).toBeVisible();
    await expect(page.locator('h3:has-text("11. Apakah wali dapat memantau kehadiran anaknya?")')).toBeVisible();
    await expect(page.locator('h3:has-text("12. Bagaimana jika anak tidak masuk karena sakit atau izin?")')).toBeVisible();
    await expect(page.locator('h2:has-text("Keuangan")')).toBeVisible();
    await expect(page.locator('h3:has-text("13. Dapatkah wali melihat tagihan dan riwayat pembayaran?")')).toBeVisible();
    await expect(page.locator('h3:has-text("14. Bagaimana cara pembayaran SPP?")')).toBeVisible();
    await expect(page.locator('h3:has-text("15. Saya sudah bayar tapi tagihan masih

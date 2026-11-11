const { test, expect } = require('@playwright/test');

test.describe('NEWS04 - Menggunakan navigasi halaman pada daftar berita', () => {
  test('Verify second page of news', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await page.locator('text="Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta\'aruf dan Silaturahmi Orang Tua Santri"').click();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita?page=2');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    const firstNewsTitleOnPage1 = await page.locator('text="Pelepasan Santri Jenjang Ibtidaiyah, Tsanawiyah, dan Mu\'allimin Tahun 2026 Berlangsung Khidmat"').textContent;
    const firstNewsTitleOnPage2 = await page.locator('text="PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S"').textContent;
    expect(firstNewsTitleOnPage2).not.toBe(firstNewsTitleOnPage1);
  });
});

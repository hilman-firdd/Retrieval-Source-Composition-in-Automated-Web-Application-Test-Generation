const { test, expect } = require('@playwright/test');

test.describe('NEWS04 - Menggunakan navigasi halaman pada daftar berita', () => {
  test('Menggunakan navigasi halaman pada daftar berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');

    // Check the first page
    const firstPageTitle = await page.getByText('Berita Terbaru');
    expect(firstPageTitle).toBeVisible();

    // Go to the second page
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita?page=2');

    // Check the second page
    const secondPageTitle = await page.getByText('Berita Terbaru');
    expect(secondPageTitle).toBeVisible();

    // Check the first news title on the second page
    const firstNewsTitle = await page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S');
    expect(firstNewsTitle).toBeVisible();

    // Check the first news title on the first page
    const firstPageFirstNewsTitle = await page.getByText('Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta\'aruf dan Silaturahmi Orang Tua Santri');
    expect(firstPageFirstNewsTitle).toBeVisible();

    // Check if the first news title on the second page is different from the first page
    expect(firstNewsTitle).not.toBe(firstPageFirstNewsTitle);
  });
});

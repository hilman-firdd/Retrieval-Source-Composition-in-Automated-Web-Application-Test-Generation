const { test, expect } = require('@playwright/test');

test.describe('NEWS03 - Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await page.click('text="Berita Terbaru"');
    await expect(page.getByText('Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta\'aruf dan Silaturahmi Orang Tua Santri')).toBeVisible();
  });
});

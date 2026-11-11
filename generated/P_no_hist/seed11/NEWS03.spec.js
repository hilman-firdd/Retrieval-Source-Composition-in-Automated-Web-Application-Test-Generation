const { test, expect } = require('@playwright/test');

test.describe('NEWS03 - Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsTitle = await page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S');
    await newsTitle.click();
    await page.waitForLoadState('networkidle');
    const detailPageTitle = await page.getByRole('heading', { name: 'PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S' });
    expect(await detailPageTitle.textContent()).toBe(await newsTitle.textContent());
  });
});

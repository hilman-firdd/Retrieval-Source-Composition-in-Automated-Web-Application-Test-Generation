const { test, expect } = require('@playwright/test');

test.describe('NEWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const newsList = await page.locator('ul:has-text("Berita")').first();
    const newsTitle = await newsList.locator('a').getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten Semarang').first();
    await newsTitle.click();
    await page.waitForLoadState('networkidle');
    const detailPage = await page.locator('h1').first();
    const detailPageText = await detailPage.textContent();
    expect(detailPageText).toBe('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten Semarang');
  });
});

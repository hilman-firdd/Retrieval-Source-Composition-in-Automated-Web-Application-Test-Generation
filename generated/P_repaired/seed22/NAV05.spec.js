const { test, expect } = require('@playwright/test');

test.describe('Navigasi - kembali ke beranda dari daftar berita', () => {
  test('kembali ke beranda dari daftar berita', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.getByText('PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S')).toBeVisible();

    await page.getByRole('link', { name: 'Beranda' }).click();
    await expect(page).toHaveURL('/portal');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
  });
});

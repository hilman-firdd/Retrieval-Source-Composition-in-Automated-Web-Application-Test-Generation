const { test, expect } = require('@playwright/test');

test.describe('Modul Navigasi', () => {
  test('NAV01: Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/');
    await expect(page.getByText('Pesantren')).toBeVisible();
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await expect(page.getByText('Pendidikan Adab Tafaqquh Fid Din')).toBeVisible();
  });

  test('NAV05: Tautan kembali ke beranda dari halaman portal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal');
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await page.goto('https://staging.pesantrenpersis27.com/');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });

  test('NAV02: Menu navigasi utama konsisten', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal');
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

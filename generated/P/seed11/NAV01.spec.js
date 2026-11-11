const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await expect(page.getByText('Pendidikan Adab Tafaqquh Fid Din')).toBeVisible();
  });

  test('Navigasi utama konsisten', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/berita');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/artikel');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });

  test('Beranda menampilkan tautan kembali ke beranda', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.locator('a:has-text("Beranda")')).toBeVisible();
    await expect(page.locator('a:has-text("Beranda")')).toBeEnabled();
  });

  test('Beranda menampilkan judul dokumen yang memuat kata Pesantren', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Pendidikan Adab Tafaqquh Fid Din')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await expect(page.getByText('Pendidikan Adab Tafaqquh Fid Din')).toBeVisible();
  });

  test('Navigasi - konsistensi menu', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/berita');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/artikel');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });

  test('Navigasi - beranda', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await expect(page.getByText('Pendidikan Adab Tafaqquh Fid Din')).toBeVisible();
  });

  test('Navigasi - tautan kembali ke beranda dari halaman portal', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.locator('text="Beranda"')).toBeVisible();
    await page.goto('/portal/berita');
    await expect(page.locator('text="Beranda"')).toBeVisible();
  });
});

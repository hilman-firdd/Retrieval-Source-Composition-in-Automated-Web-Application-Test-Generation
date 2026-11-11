const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await expect(page.getByText('Pendidikan Adab Tafaqquh Fid Din')).toBeVisible();
  });

  test('Tautan kembali ke beranda dari halaman portal', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.locator('text="Beranda"')).toBeVisible();
    await page.click('text="Beranda"');
    await expect(page).toHaveTitle('/');
  });

  test('Menu navigasi utama konsisten', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await page.goto('/portal/berita');
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await page.goto('/portal/artikel');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });

  test('Halaman berita - paginasi', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulHalamanPertama = await page.locator('h3').first().textContent();

    await page.goto('/portal/berita?page=2');
    const judulHalamanKedua = await page.locator('h3').first().textContent();

    expect(judulHalamanKedua).not.toEqual(judulHalamanPertama);
  });

  test('Tautan kembali ke beranda dari halaman berita', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.locator('text="Beranda"')).toBeVisible();
    await page.click('text="Beranda"');
    await expect(page).toHaveTitle('/');
  });
});

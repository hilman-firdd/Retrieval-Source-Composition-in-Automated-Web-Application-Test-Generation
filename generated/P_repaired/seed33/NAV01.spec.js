const { test, expect } = require('@playwright/test');

test.describe('Navigasi - beranda', () => {
  test('beranda menampilkan identitas situs dan menu utama', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });

  test('Tautan kembali ke beranda dari halaman portal', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.locator('text="Beranda"')).toBeVisible();
    await page.click('text="Beranda"');
    await expect(page).toHaveTitle('/');
  });
});

test.describe('Navigasi - konsistensi menu', () => {
  test('menu utama tetap terlihat di beranda, berita, dan artikel', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/berita');
    await expect(page.locator('#portalNavbar')).toBeVisible();

    await page.goto('/portal/artikel');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

test.describe('Daftar berita - paginasi', () => {
  test('halaman kedua menampilkan judul berita yang berbeda dari halaman pertama', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulHalamanPertama = await page.locator('h3').first().textContent();

    await page.goto('/portal/berita?page=2');
    const judulHalamanKedua = await page.locator('h3').first().textContent();

    expect(judulHalamanKedua).not.toEqual(judulHalamanPertama);
  });
});

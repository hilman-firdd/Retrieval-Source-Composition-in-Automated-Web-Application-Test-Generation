const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('a[href="/portal"]').first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Tautan kembali ke beranda dari halaman portal', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.locator('a[href="/portal"]').first()).toBeVisible();
  });

  test('Menu navigasi utama konsisten', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await page.goto('/portal/berita');
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await page.goto('/portal/artikel');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });

  test('Berita - paginasi', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulHalamanPertama = await page.locator('h3').first().textContent();

    await page.goto('/portal/berita?page=2');
    const judulHalamanKedua = await page.locator('h3').first().textContent();

    expect(judulHalamanKedua).not.toEqual(judulHalamanPertama);
  });
});

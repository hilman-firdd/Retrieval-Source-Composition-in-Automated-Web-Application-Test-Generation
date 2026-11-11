const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('Membuka beranda dan memverifikasi identitas situs', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Pesantren/i);
    await expect(page.locator('a', { name: 'Beranda' })).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Membuka berita dan memverifikasi tautan kembali ke beranda', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.locator('a', { name: 'Beranda' })).toBeVisible();
    await expect(page.locator('a', { name: 'Beranda' })).toBeEnabled();
    await page.goto('/portal/berita?page=2');
    await expect(page.locator('a', { name: 'Beranda' })).toBeVisible();
    await expect(page.locator('a', { name: 'Beranda' })).toBeEnabled();
  });

  test('Membuka berita dan memverifikasi menu navigasi utama konsisten', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.locator('a', { name: 'Beranda' })).toBeVisible();
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await page.goto('/portal/artikel');
    await expect(page.locator('#portalNavbar')).toBeVisible();
    await page.goto('/portal/berita?page=2');
    await expect(page.locator('#portalNavbar')).toBeVisible();
  });
});

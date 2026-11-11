const { test, expect } = require('@playwright/test');

test.describe('Menggunakan navigasi halaman pada daftar berita', () => {
  test('Navigasi halaman pada daftar berita', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.getByRole('heading', { name: 'Berita Terbaru' })).toBeVisible();
    const judulHalamanPertama = await page.locator('h3').first().textContent();

    await page.goto('/portal/berita?page=2');
    await expect(page).toHaveURL(/portal\/berita\/page=2$/);
    const judulHalamanKedua = await page.locator('h3').first().textContent();

    expect(judulHalamanKedua).not.toEqual(judulHalamanPertama);
  });
});

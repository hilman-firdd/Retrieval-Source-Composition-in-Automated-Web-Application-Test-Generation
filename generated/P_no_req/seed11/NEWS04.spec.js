const { test, expect } = require('@playwright/test');

test.describe('Daftar berita - navigasi halaman', () => {
  test('halaman kedua menampilkan judul berita yang berbeda dari halaman pertama', async ({ page }) => {
    await page.goto('/portal/berita');
    const judulHalamanPertama = await page.locator('h3').first().textContent();

    await page.goto('/portal/berita?page=2');
    const judulHalamanKedua = await page.locator('h3').first().textContent();

    expect(judulHalamanKedua).not.toEqual(judulHalamanPertama);
  });
});

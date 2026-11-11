const { test, expect } = require('@playwright/test');

test.describe('Daftar artikel - navigasi halaman', () => {
  test('navigasi halaman kedua menampilkan judul artikel yang berbeda', async ({ page }) => {
    await page.goto('/portal/artikel');
    const judulHalamanPertama = await page.locator('h3').first().textContent();

    await page.goto('/portal/artikel?page=2');
    const judulHalamanKedua = await page.locator('h3').first().textContent();

    expect(judulHalamanKedua).not.toEqual(judulHalamanPertama);
  });
});

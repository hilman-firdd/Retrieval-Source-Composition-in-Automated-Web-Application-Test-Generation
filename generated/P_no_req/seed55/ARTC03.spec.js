const { test, expect } = require('@playwright/test');

test.describe('Daftar artikel - navigasi halaman', () => {
  test('pindah ke halaman kedua dan menampilkan judul artikel yang berbeda', async ({ page }) => {
    await page.goto('/portal/artikel');
    await expect(page.getByRole('heading', { name: 'Artikel Tulisan Santri' })).toBeVisible();
    await page.goto('/portal/artikel?page=2');
    await expect(page).toHaveURL(/page=2/);
    const judulHalamanPertama = await page.locator('h3').first().textContent();
    const judulHalamanKedua = await page.locator('h3').first().textContent();
    expect(judulHalamanKedua).not.toEqual(judulHalamanPertama);
  });
});

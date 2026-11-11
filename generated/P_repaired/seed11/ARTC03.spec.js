const { test, expect } = require('@playwright/test');

test.describe('Daftar artikel - navigasi halaman', () => {
  test('menggunakan navigasi halaman pada daftar artikel', async ({ page }) => {
    await page.goto('/portal/artikel');
    await expect(page.getByRole('heading', { name: 'Artikel Tulisan Santri' })).toBeVisible();
    const jumlahJudul = await page.locator('h3').count();
    expect(jumlahJudul).toBeGreaterThan(0);

    await page.goto('/portal/artikel?page=2');
    await expect(page).toHaveURL('/portal/artikel?page=2');
    const judulArtikelPertamaHalamanKedua = await page.locator('h3').first().textContent();
    await expect(page.getByText(judulArtikelPertamaHalamanKedua)).toBeVisible();
    await expect(page.getByText(judulArtikelPertamaHalamanKedua)).not.toEqual(await page.locator('h3').first().textContent());
  });
});

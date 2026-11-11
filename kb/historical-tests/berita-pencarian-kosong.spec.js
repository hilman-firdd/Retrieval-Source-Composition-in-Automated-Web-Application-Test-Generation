const { test, expect } = require('@playwright/test');

test.describe('Daftar berita - pencarian tanpa hasil', () => {
  test('kata kunci yang tidak ada menampilkan pesan hasil kosong', async ({ page }) => {
    await page.goto('/portal/berita');
    await page.getByPlaceholder('Cari berita...').fill('zzzzz_kata_tidak_ada_qqqq');
    await page.getByPlaceholder('Cari berita...').press('Enter');

    await expect(page).toHaveURL(/search=/);
    await expect(page.getByText('(0 hasil)')).toBeVisible();
    await expect(page.getByText('Tidak ada berita ditemukan')).toBeVisible();
  });
});

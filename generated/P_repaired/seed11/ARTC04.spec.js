const { test, expect } = require('@playwright/test');

test.describe('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('kata kunci yang tidak ada menampilkan pesan hasil kosong', async ({ page }) => {
    await page.goto('/portal/artikel');
    await page.getByPlaceholder('Cari artikel...').fill('zzzzz_kata_tidak_ada_qqqq');
    await page.getByPlaceholder('Cari artikel...').press('Enter');

    await expect(page).toHaveURL(/search=/);
    await expect(page.getByText('Tidak ada berita ditemukan')).toBeVisible();
  });
});

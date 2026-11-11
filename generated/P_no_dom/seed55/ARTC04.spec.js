const { test, expect } = require('@playwright/test');

test.describe('Pencarian artikel - kata kunci yang tidak ada hasilnya', () => {
  test('kata kunci yang tidak ada menampilkan pesan hasil kosong', async ({ page }) => {
    await page.goto('/portal/artikel');
    await page.getByPlaceholder('Cari artikel...').fill('zzzzz_kata_tidak_ada_qqqq');
    await page.getByPlaceholder('Cari artikel...').press('Enter');

    await expect(page).toHaveURL(/search=/);
    await expect(page.getByText('(0 hasil)')).toBeVisible();
    await expect(page.getByText('Tidak ada artikel ditemukan')).toBeVisible();
  });
});

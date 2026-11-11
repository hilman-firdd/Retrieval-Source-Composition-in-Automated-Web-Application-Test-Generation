const { test, expect } = require('@playwright/test');

test.describe('Berita - Pencarian Berita Menahan Masukan yang Sangat Panjang', () => {
  test('kolom pencarian berita menahan masukan yang sangat panjang', async ({ page }) => {
    await page.goto('/portal/berita');
    await page.getByPlaceholder('Cari berita...').fill('a'.repeat(201));
    await page.getByPlaceholder('Cari berita...').press('Enter');

    await expect(page).toHaveURL(/search=/);
    await expect(() => page.getByText('Tidak ada berita ditemukan')).toBeVisible();
  });
});

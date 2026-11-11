const { test, expect } = require('@playwright/test');

test.describe('Berita - Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('kolom pencarian berita menahan masukan yang sangat panjang', async ({ page }) => {
    await page.goto('/portal/berita');
    await page.getByPlaceholder('Cari berita...').fill('a'.repeat(201));
    await page.getByPlaceholder('Cari berita...').press('Enter');

    await expect(page).toHaveURL(/search=/);
    await expect(() => page.getByText('(0 hasil)')).not.toThrow();
    await expect(() => page.getByText('Tidak ada berita ditemukan')).not.toThrow();
  });
});

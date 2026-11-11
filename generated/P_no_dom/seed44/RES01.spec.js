const { test, expect } = require('@playwright/test');

test.describe('Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('masukan sangat panjang tidak rusak tata letak halaman', async ({ page }) => {
    await page.goto('/portal/berita');
    await page.getByPlaceholder('Cari berita...').fill('a'.repeat(201));
    await page.getByPlaceholder('Cari berita...').press('Enter');

    await expect(page).toHaveURL(/search=/);
    await expect(page.getByText('(0 hasil)')).toBeVisible();
    await expect(page.getByText('Tidak ada berita ditemukan')).toBeVisible();
    await expect(page).toHaveNoJavaScriptErrors();
  });
});

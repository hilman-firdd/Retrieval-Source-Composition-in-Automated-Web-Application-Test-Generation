const { test, expect } = require('@playwright/test');

test.describe('Daftar berita - pencarian dengan kata kunci yang ada hasilnya', () => {
  test('kata kunci "santri" menampilkan hasil berita yang relevan', async ({ page }) => {
    await page.goto('/portal/berita');
    await page.getByPlaceholder('Cari berita...').fill('santri');
    await page.getByPlaceholder('Cari berita...').press('Enter');

    await expect(page).toHaveURL(/search=.*/);
    await expect(page.getByText('PELEPASAN SANTRI PDKS Tahun 2026')).toBeVisible();
  });
});

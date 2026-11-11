const { test, expect } = require('@playwright/test');

test.describe('Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('kata kunci "santri" menampilkan hasil berita yang relevan', async ({ page }) => {
    await page.goto('/portal/berita');
    await page.getByPlaceholder('Cari berita...').fill('santri');
    await page.getByPlaceholder('Cari berita...').press('Enter');

    await expect(page).toHaveURL(/search=santri/);
    await expect(page.getByRole('link', { name: 'Sambut Tahun Ajaran Baru, Pesantren PERSIS 27 Situaksan Gelar Ta'aruf dan Silaturahmi Orang Tua Santri' })).toBeVisible();
  });
});

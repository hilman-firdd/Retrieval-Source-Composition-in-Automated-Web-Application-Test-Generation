const { test, expect } = require('@playwright/test');

test.describe('Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('pencarian berita dengan input sangat panjang', async ({ page }) => {
    await page.goto('/portal/berita');
    await page.getByPlaceholder('Cari berita...').fill('a'.repeat(201));
    await page.getByPlaceholder('Cari berita...').press('Enter');

    await expect(page).toHaveURL(/search=/);
    await expect(page).not.toHaveThrown();
  });
});

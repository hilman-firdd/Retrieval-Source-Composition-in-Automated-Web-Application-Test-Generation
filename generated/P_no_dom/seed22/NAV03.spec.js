const { test, expect } = require('@playwright/test');

test.describe('Berpindah dari beranda ke daftar artikel santri', () => {
  test('berpindah ke daftar artikel santri', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Artikel Tulisan Santri' })).toBeVisible();
    await page.getByRole('link', { name: 'Lihat Semua' }).click();
    await expect(page).toHaveURL('/portal/artikel');
    await expect(page.getByRole('heading', { name: 'Artikel Tulisan Santri' })).toBeVisible();
  });
});

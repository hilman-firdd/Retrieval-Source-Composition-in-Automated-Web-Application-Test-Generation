const { test, expect } = require('@playwright/test');

test.describe('Daftar artikel santri', () => {
  test('daftar artikel memuat sedikitnya satu judul', async ({ page }) => {
    await page.goto('/portal/artikel');
    await expect(page.getByRole('heading', { name: 'Artikel Tulisan Santri' })).toBeVisible();
    const jumlahJudul = await page.locator('h3').count();
    expect(jumlahJudul).toBeGreaterThan(0);
  });
});

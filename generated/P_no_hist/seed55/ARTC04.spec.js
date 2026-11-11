const { test, expect } = require('@playwright/test');

test.describe('ARTC04 - Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.getByText('Artikel Tulisan Santri')).toBeVisible();
    await page.fill('input[name=search]', 'kata-kunci-acak');
    await page.press('input[name=search]', 'Enter');
    await expect(page.getByText('0 hasil')).toBeVisible();
    await expect(page.getByText('Tidak ada berita ditemukan')).toBeVisible();
  });
});

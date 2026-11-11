const { test, expect } = require('@playwright/test');

test.describe('NEWS06 - Pencarian berita dengan kata kunci yang tidak ada hasilnya', () => {
  test('should display "(0 hasil)" and "Tidak ada berita ditemukan" message', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await page.fill('input[name="q"]', 'kata kunci yang tidak ada');
    await page.click('button[type="submit"]');
    await expect(page.getByText('0 hasil')).toBeVisible();
    await expect(page.getByText('Tidak ada berita ditemukan')).toBeVisible();
  });
});

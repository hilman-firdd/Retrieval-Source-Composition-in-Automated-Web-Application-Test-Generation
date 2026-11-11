const { test, expect } = require('@playwright/test');

test.describe('NEWS06 - Pencarian berita dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian berita dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.getByText('Berita Terbaru').click();
    await page.fill('input[name="q"]', 'kata kunci yang tidak ada');
    await page.keyboard.press('Enter');
    await expect(page.locator('text="0 hasil"')).toBeVisible();
    await expect(page.locator('text="Tidak ada berita ditemukan"')).toBeVisible();
  });
});

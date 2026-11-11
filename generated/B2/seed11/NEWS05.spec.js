const { test, expect } = require('@playwright/test');

test.describe('NEWS05 - Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('Pencarian berita dengan kata kunci "santri"', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[placeholder="Cari berita..."]', 'santri');
    await page.press('input[placeholder="Cari berita..."]', 'Enter');
    await expect(page.locator('text="PELEPASAN SANTRI PDKS Tahun 2026"')).toBeVisible();
  });
});

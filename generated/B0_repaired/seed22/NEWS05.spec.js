const { test, expect } = require('@playwright/test');

test.describe('NEWS05: Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('Pencarian berita dengan kata kunci "santri"', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('input[placeholder="Cari berita..."]')).toBeVisible();
    await page.fill('input[placeholder="Cari berita..."]', 'santri');
    await page.keyboard.press('Enter');
    await expect(page.locator('input[placeholder="Cari berita..."]')).not.toBeVisible();
    await expect(page).toHaveURL(/.*search=santri.*/);
    await expect(page.locator('text="Pencarian berita"')).toBeVisible();
    await expect(page.locator('text="Pencarian berita"')).toBeVisible();
    await expect(page.locator('a:has-text("PELEPASAN SANTRI PDKS Tahun 2026")')).toBeVisible();
  });
});

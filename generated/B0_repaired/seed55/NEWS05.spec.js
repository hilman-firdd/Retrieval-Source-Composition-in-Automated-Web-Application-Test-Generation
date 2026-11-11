const { test, expect } = require('@playwright/test');

test.describe('NEWS05: Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('Search news with keyword', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[placeholder="Cari berita..."]', 'santri');
    await page.keyboard.press('Enter');
    await expect(page.locator('input[placeholder="Cari berita..."]')).toBeHidden();
    await expect(page.locator('text="Santri"')).toBeVisible();
    await expect(page).toHaveURL(/.*search=.*santri.*$/);
    await expect(page.locator('text="PELEPASAN SANTRI PDKS Tahun 2026"')).toBeVisible();
  });
});

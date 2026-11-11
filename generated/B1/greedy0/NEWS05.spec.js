const { test, expect } = require('@playwright/test');

test.describe('NEWS05 - Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('Pencarian berita dengan kata kunci "santri" harus menampilkan hasil yang relevan', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[placeholder="Cari berita..."]', 'santri');
    await page.press('input[placeholder="Cari berita..."]', 'Enter');
    await expect(page.locator('input[placeholder="Cari berita..."]')).not.toBeVisible();
    await expect(page.locator('h2')).toBeVisible();
  });
});

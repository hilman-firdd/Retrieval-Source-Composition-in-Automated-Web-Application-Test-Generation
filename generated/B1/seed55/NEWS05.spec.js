const { test, expect } = require('@playwright/test');

test.describe('NEWS05 - Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('Pencarian berita dengan kata kunci "santri" harus menampilkan hasil yang relevan', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[type="search"]', 'santri');
    await page.press('input[type="search"]', 'Enter');
    await expect(page.locator('input[type="search"]').locator('::placeholder')).toBe('Cari berita...');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Berita Terbaru');
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NEWS05: Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('Pencarian berita dengan kata kunci "santri" harus menampilkan hasil', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[name="q"]', 'santri');
    await page.press('input[name="q"]', 'Enter');
    await expect(page.locator('input[name="q"]').locator('::placeholder')).toBe('Cari berita...');
    await expect(page.locator('a:has-text("Pencarian berita")')).toBeVisible();
  });
});

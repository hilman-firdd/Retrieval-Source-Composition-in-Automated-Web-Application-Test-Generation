const { test, expect } = require('@playwright/test');

test.describe('INF04: Pencarian dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('input[name="q"]').getByPlaceholder('Search...')).toBeVisible();
    await page.locator('input[name="q"]').fill('random keyword');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
  });
});

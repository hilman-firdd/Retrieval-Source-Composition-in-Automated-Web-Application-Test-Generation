const { test, expect } = require('@playwright/test');

test.describe('INF04: Pencarian dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await page.fill('input[name="q"]', 'kata-kunci-tidak-ada');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('ARTC04 - Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await page.fill('[placeholder="Cari artikel..."]', 'kata kunci yang tidak ada');
    await page.click('[placeholder="Cari artikel..."]');
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
  });
});

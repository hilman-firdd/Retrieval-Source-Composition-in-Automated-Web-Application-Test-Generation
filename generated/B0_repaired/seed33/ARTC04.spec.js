const { test, expect } = require('@playwright/test');

test.describe('ARTC04: Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('input[placeholder="Cari artikel..."]')).toBeVisible();
    await page.locator('input[placeholder="Cari artikel..."]').fill('random keyword');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
    await expect(page.locator('input[placeholder="Cari artikel..."]')).toBeVisible();
  });
});

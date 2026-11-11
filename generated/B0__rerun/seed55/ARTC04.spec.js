const { test, expect } = require('@playwright/test');

test.describe('ARTC04: Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('input[placeholder="Cari artikel..."]')).toBeVisible();
    await page.fill('input[placeholder="Cari artikel..."]', 'random keyword');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Tidak Ditemukan');
    await expect(page.locator('main')).toBeVisible();
  });
});

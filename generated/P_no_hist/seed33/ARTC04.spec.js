const { test, expect } = require('@playwright/test');

test.describe('ARTC04 - Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('input[name="search"]').placeholder).toBe('Cari artikel...');
    await page.fill('input[name="search"]', 'kata-kunci-acak');
    await page.locator('input[name="search"]').press('Enter');
    await expect(page.locator('h2:has-text("Tidak ada berita ditemukan")')).toBeVisible();
    await expect(page.locator('h2:has-text("Tidak ada berita ditemukan")')).toBeVisible();
  });
});

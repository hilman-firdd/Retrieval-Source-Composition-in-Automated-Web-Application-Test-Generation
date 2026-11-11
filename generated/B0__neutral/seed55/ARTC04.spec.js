const { test, expect } = require('@playwright/test');

test.describe('ARTC04: Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await page.fill('input[name="q"]', 'katakuncitidakada');
    await page.click('button[type="submit"]');
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).toBeVisible();
    await expect(page.locator('text="Tidak ada hasil yang ditemukan"')).not.toBeVisible('error');
    await expect(page.locator('a:has-text("Beranda")')).toBeVisible();
  });
});

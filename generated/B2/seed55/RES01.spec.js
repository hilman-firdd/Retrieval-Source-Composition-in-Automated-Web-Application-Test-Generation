const { test, expect } = require('@playwright/test');

test.describe('RES01 - Kolom pencarian berita menahan masukan yang sangat panjang', () => {
  test('should not break the layout', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[name="q"]', 'a'.repeat(200));
    await page.keyboard.press('Enter');
    await expect(page.locator('text="Berita Terbaru"')).toBeVisible();
    await expect(page.locator('text="PPI 27 Situaksan Bandung Lepas Santri PDKS 2026; Dari Situaksan Menebar Kebaikan Menuju Getasan dan Blancir, Kabupaten S"')).toBeVisible();
  });
});

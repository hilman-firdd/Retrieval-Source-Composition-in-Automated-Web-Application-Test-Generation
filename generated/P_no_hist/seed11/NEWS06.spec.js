const { test, expect } = require('@playwright/test');

test.describe('NEWS06 - Pencarian berita dengan kata kunci yang tidak ada hasilnya', () => {
  test('should display "0 hasil" and "Tidak ada berita ditemukan" message', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await page.fill('input[name=search]', 'kata-kunci-acak');
    await page.press('input[name=search]', 'Enter');
    await expect(page.locator('text="0 hasil"')).toBeVisible();
    await expect(page.locator('text="Tidak ada berita ditemukan"')).toBeVisible();
  });
});

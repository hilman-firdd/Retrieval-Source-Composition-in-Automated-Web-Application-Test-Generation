const { test, expect } = require('@playwright/test');

test.describe('NEWS06', () => {
  test('Pencarian berita dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('input[name="q"]').first()).toBeVisible();
    await page.locator('input[name="q"]').first().fill('kata kunci yang tidak ada');
    await page.locator('button[type="submit"]').first().click();
    await expect(page.locator('text="0 hasil"')).toBeVisible();
    await expect(page.locator('text="Tidak ada berita ditemukan"')).toBeVisible();
  });
});

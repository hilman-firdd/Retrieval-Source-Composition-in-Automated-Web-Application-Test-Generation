const { test, expect } = require('@playwright/test');

test.describe('ARTC04: Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await page.fill('input[name="q"]', 'kata kunci yang tidak ada');
    await page.click('button[type="submit"]');
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Tidak Ditemukan');
  });
});

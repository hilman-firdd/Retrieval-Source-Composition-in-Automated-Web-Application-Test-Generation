const { test, expect } = require('@playwright/test');

test.describe('ARTC04 - Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await page.locator('input[name="q"]').fill('kata kunci yang tidak ada');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h2')).not.toBeVisible();
    await expect(page.locator('h3')).not.toBeVisible();
    await expect(page.locator('ul')).not.toBeVisible();
    await expect(page.locator('div')).not.toBeVisible();
  });
});

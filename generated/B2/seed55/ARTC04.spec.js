const { test, expect } = require('@playwright/test');

test.describe('ARTC04 - Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('should display empty search result', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await page.fill('input[type="search"]', 'kata-kunci-tidak-ada-hasil');
    await page.press('input[type="search"]', 'Enter');
    await expect(page.locator('h2')).not.toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('INF03: Mencari informasi melalui kolom pencarian', () => {
  test('Search results page is opened', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await page.fill('input[name="q"]', 'informasi');
    await page.keyboard.press('Enter');
    await expect(page.locator('text="Informasi"')).toBeVisible();
    await expect(page.locator('text="informasi"')).toBeVisible();
  });
});

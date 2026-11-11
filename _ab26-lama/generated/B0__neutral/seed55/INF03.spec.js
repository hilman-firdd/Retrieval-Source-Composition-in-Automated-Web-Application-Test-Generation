const { test, expect } = require('@playwright/test');

test.describe('INF03: Mencari informasi melalui kolom pencarian', () => {
  test('Search results page is opened', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('input[name="q"]').first()).toBeVisible();
    await page.locator('input[name="q"]').first().fill('test');
    await page.locator('button[type="submit"]').first().click();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[name="q"]').first()).toHaveValue('test');
  });
});

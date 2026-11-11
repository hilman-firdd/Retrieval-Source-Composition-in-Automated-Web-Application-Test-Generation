const { test, expect } = require('@playwright/test');

test.describe('INF03: Mencari informasi melalui kolom pencarian', () => {
  test('Search results page is opened', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('input[name="q"]').fill('kata kunci')).toBeVisible();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[name="q"]').locator('value')).toBe('kata kunci');
  });
});

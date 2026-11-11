const { test, expect } = require('@playwright/test');

test.describe('ARTC02: Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('a[test-id="article-list-item-0"]')).toBeVisible();
    await page.locator('a[test-id="article-list-item-0"]').click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/*');
    await expect(page.locator('h1')).toBeVisible();
  });
});

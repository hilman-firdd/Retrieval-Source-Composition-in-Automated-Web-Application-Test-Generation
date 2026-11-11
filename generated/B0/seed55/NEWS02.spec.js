const { test, expect } = require('@playwright/test');

test.describe('NEWS02: Membuka detail berita dari daftar', () => {
  test('Membuka detail berita dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('a[test-id="news-list-item-0"]')).toBeVisible();
    await page.locator('a[test-id="news-list-item-0"]').click();
    await expect(page).toHaveURL(/portal\/[a-zA-Z0-9-]+/);
    await expect(page.locator('h1')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('ARTC02 - Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');

    // Click the first article title
    await page.locator('text="Artikel Santri"').first().click();

    // Assert the URL has changed to the article detail page
    await expect(page).toHaveUrl(/\/portal\/[a-zA-Z0-9-]+/);

    // Assert the article title is visible on the detail page
    await expect(page.locator('h1')).toBeVisible();
  });
});

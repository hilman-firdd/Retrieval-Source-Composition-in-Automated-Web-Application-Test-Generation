const { test, expect } = require('@playwright/test');

test.describe('ARTC02 - Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');

    // Click the first article title
    const articleTitle = page.locator('h3:has-text("Menata Amal Shalih dalam Skala Prioritas")');
    await articleTitle.click();

    // Assert the URL has changed to the article detail page
    await expect(page).toHaveURL(/portal\/[a-zA-Z0-9_-]+/);

    // Assert the article title is visible on the detail page
    const articleTitleDetail = page.locator('h1:has-text("Artikel Tulisan Santri")');
    await expect(articleTitleDetail).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('ARTC02 - Membuka detail artikel dari daftar', () => {
  test('Membuka detail artikel dari daftar', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');

    // Click the first article title to open the detail page
    const articleTitle = await page.locator('text="Artikel Santri - Portal Pesantren PERSIS 27"').first();
    await articleTitle.click();

    // Assert the URL has changed to the detail page
    expect(await page.url()).toBe('https://staging.pesantrenpersis27.com/portal/artikel/<slug-artikel>');

    // Assert the article title is visible on the detail page
    const articleTitleDetail = await page.locator('text="Artikel Santri - Portal Pesantren PERSIS 27"');
    expect(await articleTitleDetail.isVisible()).toBe(true);
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NWS05 - Memverifikasi tanggal terbit tercantum pada detail berita', () => {
  test('Verify publication date is displayed on news detail page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita/1');
    const publicationDate = page.locator('text=Publication Date: *');
    await expect(publicationDate).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NEWS02 - Membuka detail berita dari daftar', () => {
  test('Verify detail page is opened', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/berita');
    await page.locator('text="Berita Terbaru"').click();
    await expect(page).toHaveURL('/portal/berita/berita-terbaru');
    await expect(page.locator('h1')).toBeVisible();
  });
});

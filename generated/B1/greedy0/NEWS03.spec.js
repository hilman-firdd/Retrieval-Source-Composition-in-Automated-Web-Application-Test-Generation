const { test, expect } = require('@playwright/test');

test.describe('NEWS03', () => {
  test('Judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h1')).toBeVisible();
    await page.click('text="Judul berita pertama"');
    await page.waitForSelector('h1');
    await expect(page.locator('h1')).toHaveText('Judul berita pertama');
  });
});

const { test, expect } = require('@playwright/test');

test.describe('ARTC03 - Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Navigasi halaman daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('h3')).toBeVisible();
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel?page=2');
    await expect(page.locator('h3')).toBeVisible();
    const firstArticleTitle = await page.locator('h3').first().textContent();
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    const secondArticleTitle = await page.locator('h3').first().textContent();
    expect(firstArticleTitle).not.toBe(secondArticleTitle);
  });
});

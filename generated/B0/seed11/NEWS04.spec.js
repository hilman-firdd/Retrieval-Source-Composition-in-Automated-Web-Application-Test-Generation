const { test, expect } = require('@playwright/test');

test.describe('NEWS04 - Menggunakan navigasi halaman pada daftar berita', () => {
  test('Verify second page of news list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita?page=2');
    await expect(page.locator('h1')).toBeVisible();
    const firstNewsTitleOnPage1 = await page.locator('h1').textContent();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h1')).toBeVisible();
    const firstNewsTitleOnPage2 = await page.locator('h1').textContent();
    expect(firstNewsTitleOnPage1).not.toBe(firstNewsTitleOnPage2);
  });
});

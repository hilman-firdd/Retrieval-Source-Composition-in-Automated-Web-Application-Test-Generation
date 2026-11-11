const { test, expect } = require('@playwright/test');

test.describe('NEWS04: Menggunakan navigasi halaman pada daftar berita', () => {
  test('Verify second page of news list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita?page=2');
    await expect(page.locator('text=Berita')).toBeVisible();
    const firstNewsTitleOnPage1 = await page.locator('text=Berita').locator('li').locator('a').first().textContent();
    const firstNewsTitleOnPage2 = await page.locator('text=Berita').locator('li').locator('a').first().textContent();
    expect(firstNewsTitleOnPage1).not.toBe(firstNewsTitleOnPage2);
  });
});

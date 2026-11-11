const { test, expect } = require('@playwright/test');

test.describe('NEWS04: Menggunakan navigasi halaman pada daftar berita', () => {
  test('Verify second page of news list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita?page=2');
    await expect(page.locator('text=Berita')).toBeVisible();
    const firstNewsTitleOnPage1 = await page.locator('text=Berita').locator('li').first().locator('h2').textContent();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('text=Berita')).toBeVisible();
    const firstNewsTitleOnPage2 = await page.locator('text=Berita').locator('li').first().locator('h2').textContent();
    expect(firstNewsTitleOnPage1).not.toBe(firstNewsTitleOnPage2);
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NEWS04: Menggunakan navigasi halaman pada daftar berita', () => {
  test('Verify second page of news list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita?page=2');
    await expect(page.locator('text=Berita')).toBeVisible();
    const firstNewsTitle = await page.locator('text=Berita').first().textContent();
    const secondNewsTitle = await page.locator('text=Berita').nth(1).textContent();
    expect(firstNewsTitle).not.toBe(secondNewsTitle);
  });
});

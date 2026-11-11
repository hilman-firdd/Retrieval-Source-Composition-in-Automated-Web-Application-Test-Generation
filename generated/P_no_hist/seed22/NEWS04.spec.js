const { test, expect } = require('@playwright/test');

test.describe('NEWS04 - Menggunakan navigasi halaman pada daftar berita', () => {
  test('Navigasi halaman daftar berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h3')).toBeVisible();
    await page.locator('text="Berita Terbaru"').click();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita?page=2');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h3')).toBeVisible();
    const firstArticleTitle = await page.locator('h3').first().textContent();
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    const secondArticleTitle = await page.locator('h3').first().textContent();
    expect(firstArticleTitle).not.toBe(secondArticleTitle);
  });
});

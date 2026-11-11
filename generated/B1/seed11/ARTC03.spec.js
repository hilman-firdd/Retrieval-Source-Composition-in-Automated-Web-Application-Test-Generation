const { test, expect } = require('@playwright/test');

test.describe('ARTC03 - Menggunakan navigasi halaman pada daftar artikel', () => {
  test('Menggunakan navigasi halaman pada daftar artikel', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');

    // Assert that the first article title on the first page is correct
    const firstArticleTitle = await page.locator('text=Artikel Santri').textContent();
    expect(firstArticleTitle).toBe('Artikel Santri');

    // Click the second page button
    await page.locator('text=2').click();

    // Assert that the first article title on the second page is different from the first page
    const secondPageFirstArticleTitle = await page.locator('text=Artikel Santri').textContent();
    expect(secondPageFirstArticleTitle).not.toBe(firstArticleTitle);
  });
});

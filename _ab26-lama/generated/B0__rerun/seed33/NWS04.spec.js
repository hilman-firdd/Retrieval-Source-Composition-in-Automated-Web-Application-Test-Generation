const { test, expect } = require('@playwright/test');

test.describe('NWS04 - Menggunakan navigasi halaman pada daftar berita', () => {
  test('Menggunakan navigasi halaman pada daftar berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    await expect(page.locator('text="Berikutnya"')).toBeVisible();
    await page.locator('text="Berikutnya"').click();
    await expect(page.locator('text="Sebelumnya"')).toBeVisible();
    const secondPageNews = await page.locator('text="Berita"').first().textContent;
    const firstPageNews = await page.locator('text="Berita"').nth(0).textContent;
    expect(secondPageNews).not.toBe(firstPageNews);
  });
});

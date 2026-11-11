const { test, expect } = require('@playwright/test');

test.describe('NEWS04 - Menggunakan navigasi halaman pada daftar berita', () => {
  test('Verify second page of news list', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('text="Berita Terbaru"')).toBeVisible();
    await page.locator('text="Berita Terbaru"').click();
    await page.locator('text="Berita Terbaru"').fill('2');
    await page.locator('text="Berita Terbaru"').press('Enter');
    await expect(page.locator('text="Berita Terbaru"')).toBeVisible();
    const firstNewsTitle = await page.locator('text="Berita Terbaru"').textContent();
    await page.locator('text="Berita Terbaru"').click();
    await page.locator('text="Berita Terbaru"').fill('2');
    await page.locator('text="Berita Terbaru"').press('Enter');
    await expect(page.locator('text="Berita Terbaru"')).toBeVisible();
    const secondNewsTitle = await page.locator('text="Berita Terbaru"').textContent();
    expect(firstNewsTitle).not.toBe(secondNewsTitle);
  });
});

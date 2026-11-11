const { test, expect } = require('@playwright/test');

test.describe('NEWS03', () => {
  test('Judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h1')).toBeVisible();
    await page.click('text="Judul Berita"'); // replace with actual locator
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita/detail');
    await expect(page.locator('h1')).toHaveText(await page.locator('text="Judul Berita"').textContent); // replace with actual locator
  });
});

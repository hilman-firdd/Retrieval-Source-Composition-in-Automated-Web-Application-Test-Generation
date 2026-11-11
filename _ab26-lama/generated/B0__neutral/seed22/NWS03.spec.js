const { test, expect } = require('@playwright/test');

test.describe('NWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    const listTitle = await page.locator('text=Judul Berita').first();
    await listTitle.click();
    const detailPage = await page.waitForSelector('text=Detail Berita');
    await expect(detailPage).toBeVisible();
    const detailTitle = await page.locator('text=Detail Berita').first();
    await expect(detailTitle).toHaveText(await listTitle.textContent());
  });
});

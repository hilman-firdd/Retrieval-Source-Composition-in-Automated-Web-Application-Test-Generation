const { test, expect } = require('@playwright/test');

test.describe('NWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Judul berita pada daftar konsisten dengan halaman detail', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    const listTitle = await page.locator('text="Judul Berita"').getByText('Judul Berita');
    await listTitle.click();
    const detailPage = await page.goto('https://staging.pesantrenpersis27.com/berita');
    const detailTitle = await page.locator('text="Judul Berita"').getByText('Judul Berita');
    expect(await detailTitle.textContent()).toBe(await listTitle.textContent());
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NWS03: Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    const firstTitle = await page.locator('text=.*').first();
    await firstTitle.click();
    await page.waitForLoadState('networkidle');
    const detailTitle = await page.locator('text=.*').first();
    expect(firstTitle).toHaveText(detailTitle);
  });
});

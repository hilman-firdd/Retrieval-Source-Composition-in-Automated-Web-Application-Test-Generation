const { test, expect } = require('@playwright/test');

test.describe('NEWS03 - Judul berita pada daftar konsisten dengan halaman detail', () => {
  test('Verify news title consistency', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('h1')).toBeVisible();
    await page.click('h1');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toHaveText(await page.locator('h1').textContent);
  });
});

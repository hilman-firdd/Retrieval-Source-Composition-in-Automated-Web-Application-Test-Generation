const { test, expect } = require('@playwright/test');

test.describe('NWS04 - Menggunakan navigasi halaman pada daftar berita', () => {
  test('Menggunakan navigasi halaman pada daftar berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/berita');
    await expect(page.locator('div[data-test-id="pagination"]')).toBeVisible();
    await page.locator('button[data-test-id="pagination-next"]').click();
    await expect(page.locator('div[data-test-id="pagination"]').locator('li')).not.toContainText('1');
    await expect(page.locator('div[data-test-id="pagination"]').locator('li')).toContainText('2');
  });
});

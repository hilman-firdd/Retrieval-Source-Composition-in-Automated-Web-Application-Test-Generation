const { test, expect } = require('@playwright/test');

test.describe('NAV08: Menangani alamat halaman yang tidak dikenal', () => {
  test('Navigation: Unknown page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/halaman-tidak-ada-12345');
    await expect(page.locator('h1:has-text("Not Found")')).toBeVisible();
    await expect(page.locator('text="404 NOT FOUND"')).toBeVisible();
  });
});

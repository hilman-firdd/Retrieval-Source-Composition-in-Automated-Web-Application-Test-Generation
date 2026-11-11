const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('NAV08: Menangani alamat halaman yang tidak dikenal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/halaman-tidak-ada-12345');

    await expect(page.getByText('Not Found')).toBeVisible();
    await expect(page.getByText('404 NOT FOUND')).toBeVisible();
  });
});

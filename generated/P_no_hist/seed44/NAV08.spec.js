const { test, expect } = require('@playwright/test');

test.describe('NAV08 - Menangani alamat halaman yang tidak dikenal', () => {
  test('Menangani alamat halaman yang tidak dikenal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/halaman-tidak-ada-12345');

    await expect(page.getByText('Not Found')).toBeVisible();
    await expect(page.getByText('404 NOT FOUND')).toBeVisible();
  });
});

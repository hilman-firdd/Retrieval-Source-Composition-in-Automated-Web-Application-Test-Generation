const { test, expect } = require('@playwright/test');

test.describe('NAV08 - Menangani alamat halaman yang tidak dikenal', () => {
  test('should display not found page', async ({ page }) => {
    await page.goto('/halaman-tidak-ada-12345');
    await expect(page.getByText('Not Found')).toBeVisible();
    await expect(page.getByText('404 NOT FOUND')).toBeVisible();
  });
});

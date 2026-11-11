const { test, expect } = require('@playwright/test');

test.describe('NAV08 - Menangani alamat halaman yang tidak dikenal', () => {
  test('should display "Not Found" and "404 NOT FOUND" without backlink to home', async ({ page }) => {
    await page.goto('/halaman-tidak-ada-12345');
    await expect(page.locator('h1')).toContainText('Not Found');
    await expect(page.locator('text="404 NOT FOUND"')).toBeVisible();
  });
});

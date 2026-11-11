const { test, expect } = require('@playwright/test');

test.describe('REG02 - Memverifikasi tautan ke formulir eksternal tanpa mengisinya', () => {
  test('Verify "Buka di tab baru" link', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-pesantren-khusus');
    const link = page.locator('text="Buka di tab baru"');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /docs\.google\.com\/forms/);
  });
});

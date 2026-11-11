const { test, expect } = require('@playwright/test');

test.describe('REG02 - Memverifikasi tautan ke formulir eksternal tanpa mengisinya', () => {
  test('Memverifikasi tautan ke formulir eksternal tanpa mengisinya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByRole('link', { name: 'Buka di tab baru' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Buka di tab baru' })).toHaveAttribute('href', /docs\.google\.com\/forms/);
  });
});

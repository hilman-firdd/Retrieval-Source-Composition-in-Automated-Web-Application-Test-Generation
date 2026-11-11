const { test, expect } = require('@playwright/test');

test.describe('REG02 - Memverifikasi tautan ke formulir eksternal tanpa mengisinya', () => {
  test('tautan ke formulir eksternal terlihat dan mengarah ke docs.google.com/forms', async ({ page }) => {
    await page.goto('/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByRole('link', { name: 'Buka di tab baru' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Buka di tab baru' })).toHaveAttribute('href', /docs\.google\.com\/forms/);
  });
});

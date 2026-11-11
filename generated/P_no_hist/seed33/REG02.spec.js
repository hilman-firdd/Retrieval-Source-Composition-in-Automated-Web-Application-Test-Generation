const { test, expect } = require('@playwright/test');

test.describe('REG02 - Memverifikasi tautan ke formulir eksternal tanpa mengisinya', () => {
  test('Verify registration form link', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-pesantren-khusus');
    const registrationFormLink = page.getByRole('link', { name: 'Buka di tab baru' });
    await expect(registrationFormLink).toBeVisible();
    await expect(registrationFormLink).toHaveAttribute('href', /docs\.google\.com\/forms/);
  });
});

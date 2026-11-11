const { test, expect } = require('@playwright/test');

test.describe('REG02 - Memverifikasi tautan ke formulir eksternal tanpa mengisinya', () => {
  test('Verifikasi tautan ke formulir eksternal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-pesantren-khusus');
    const link = await page.getByRole('link', { name: 'Buka di tab baru' });
    expect(link).toBeVisible();
    expect(await link.getAttribute('href')).toBe('https://docs.google.com/forms/...');
  });
});

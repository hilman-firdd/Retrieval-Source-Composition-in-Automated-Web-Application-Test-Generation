const { test, expect } = require('@playwright/test');

test.describe('REG02 - Memverifikasi tautan ke formulir eksternal tanpa mengisinya', () => {
  test('Verify the link to the external form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-pesantren-khusus');
    const link = await page.locator('text="Buka di tab baru"').first();
    expect(link).toBeVisible();
    expect(link.getAttribute('href')).toBe('https://docs.google.com/forms');
  });
});

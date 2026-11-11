const { test, expect } = require('@playwright/test');

test.describe('REG01 - Mengakses halaman pendaftaran pesantren khusus', () => {
  test('Mengakses halaman pendaftaran pesantren khusus', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByText('PENDAFTARAN PESANTREN KHUSUS')).toBeVisible();
  });
});

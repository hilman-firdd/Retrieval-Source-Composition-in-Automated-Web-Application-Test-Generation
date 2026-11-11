const { test, expect } = require('@playwright/test');

test.describe('Pendaftaran pesantren khusus', () => {
  test('mengakses halaman pendaftaran pesantren khusus', async ({ page }) => {
    await page.goto('/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByText('PENDAFTARAN PESANTREN KHUSUS')).toBeVisible();
  });
});

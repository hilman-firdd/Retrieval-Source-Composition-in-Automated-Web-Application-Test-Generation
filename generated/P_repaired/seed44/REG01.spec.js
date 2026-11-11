const { test, expect } = require('@playwright/test');

test.describe('Pendaftaran Pesantren Khusus', () => {
  test('Mengakses halaman pendaftaran pesantren khusus', async ({ page }) => {
    await page.goto('/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByRole('heading', { name: 'PENDAFTARAN PESANTREN KHUSUS' })).toBeVisible();
  });
});

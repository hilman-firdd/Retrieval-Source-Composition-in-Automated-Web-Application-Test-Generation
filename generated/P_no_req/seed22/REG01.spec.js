const { test, expect } = require('@playwright/test');

test.describe('REG01 - Mengakses halaman pendaftaran pesantren khusus', () => {
  test('halaman menampilkan judul', async ({ page }) => {
    await page.goto('/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByText('PENDAFTARAN PESANTREN KHUSUS')).toBeVisible();
  });
});

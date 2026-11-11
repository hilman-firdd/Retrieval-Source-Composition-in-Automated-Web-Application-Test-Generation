const { test, expect } = require('@playwright/test');

test.describe('Pendaftaran pesantren khusus', () => {
  test('mengakses halaman pendaftaran pesantren khusus', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByRole('heading', { name: 'PENDAFTARAN PESANTREN KHUSUS' })).toBeVisible();
  });
});

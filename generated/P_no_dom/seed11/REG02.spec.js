const { test, expect } = require('@playwright/test');

test.describe('Pendaftaran pesantren khusus', () => {
  test('Memverifikasi tautan ke formulir eksternal tanpa mengisinya', async ({ page }) => {
    await page.goto('/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByRole('heading', { name: 'PENDAFTARAN PESANTREN KHUSUS' })).toBeVisible();

    const tautanFormulir = page.getByRole('link', { name: 'Buka di tab baru' });
    await expect(tautanFormulir).toBeVisible();
    await expect(tautanFormulir).toHaveAttribute('href', /docs\.google\.com\/forms/);
  });
});

const { test, expect } = require('@playwright/test');

// Formulir pendaftaran adalah embed Google Form pihak ketiga. Tes ini SENGAJA
// hanya memverifikasi kehadiran tautannya dan tidak mengisi atau mengirim
// formulir tersebut — lihat REQ-REG-02.
test.describe('Pendaftaran pesantren khusus', () => {
  test('halaman menampilkan judul dan tautan ke formulir eksternal', async ({ page }) => {
    await page.goto('/portal/halaman/pendaftaran-pesantren-khusus');
    await expect(page.getByRole('heading', { name: 'PENDAFTARAN PESANTREN KHUSUS' })).toBeVisible();

    const tautanFormulir = page.getByRole('link', { name: 'Buka di tab baru' });
    await expect(tautanFormulir).toBeVisible();
    await expect(tautanFormulir).toHaveAttribute('href', /docs\.google\.com\/forms/);
  });
});

const { test, expect } = require('@playwright/test');

test.describe('FAQ SIMASIS', () => {
  test('membaca FAQ SIMASIS tanpa perlu mengeklik', async ({ page }) => {
    await page.goto('/portal/halaman/faq-simasis');
    await expect(page.getByRole('heading', { name: 'FAQ SIMASIS' }).first()).toBeVisible();
    await expect(page.getByText('1. Apa itu SIMASIS?')).toBeVisible();
    await expect(page.getByText('Sistem Informasi Manajemen Santri dan Pesantren', { exact: false })).toBeVisible();
    await expect(page.getByText('15. Saya sudah bayar tapi tagihan masih aktif, kenapa?')).toBeVisible();
    await expect(page.getByText('16. Apakah SIMASIS bisa diakses dari HP?')).toBeVisible();
    await expect(page.getByText('17. Peramban apa yang direkomendasikan?')).toBeVisible();
    await expect(page.getByText('18. SIMASIS tidak bisa dibuka, apa yang harus dilakukan?')).toBeVisible();
    await expect(page.getByText('19. Data saya tampak keliru/hilang, apa yang harus dilakukan?')).toBeVisible();
    await expect(page.getByText('20. Apakah data di SIMASIS aman?')).toBeVisible();
  });
});

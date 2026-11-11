const { test, expect } = require('@playwright/test');

test.describe('FAQ SIMASIS', () => {
  test('membaca FAQ SIMASIS tanpa perlu mengeklik', async ({ page }) => {
    await page.goto('/portal/halaman/faq-simasis');
    await expect(page.getByRole('heading', { name: 'FAQ SIMASIS' }).first()).toBeVisible();
    await expect(page.getByText('1. Apa itu SIMASIS?')).toBeVisible();
    await expect(page.getByText('Sistem Informasi Manajemen Santri dan Pesantren', { exact: false })).toBeVisible();
    await expect(page.getByText('15. Saya sudah bayar tapi tagihan masih aktif, kenapa?')).toBeVisible();
    await expect(page.getByText('Teknis')).toBeVisible();
    await expect(page.getByText('Kontak Bantuan')).toBeVisible();
  });
});

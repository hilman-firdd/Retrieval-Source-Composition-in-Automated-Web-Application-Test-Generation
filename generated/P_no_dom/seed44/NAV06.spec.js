const { test, expect } = require('@playwright/test');

test.describe('NAV06 Membuka FAQ SIMASIS dari tautan footer', () => {
  test('membuka halaman FAQ SIMASIS', async ({ page }) => {
    await page.goto('/');
    await page.goto('/portal/halaman/faq-simasis');
    await expect(page.getByRole('heading', { name: 'FAQ SIMASIS' })).toBeVisible();
    await expect(page.getByText('1. Apa itu SIMASIS?')).toBeVisible();
    await expect(page.getByText('Sistem Informasi Manajemen Santri dan Pesantren', { exact: false })).toBeVisible();
  });
});

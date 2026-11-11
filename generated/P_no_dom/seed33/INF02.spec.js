const { test, expect } = require('@playwright/test');

test.describe('FAQ SIMASIS', () => {
  test('Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');
    await expect(page.getByRole('heading', { name: 'FAQ SIMASIS' })).toBeVisible();
    await expect(page.getByText('1. Apa itu SIMASIS?')).toBeVisible();
    await expect(page.getByText('Sistem Informasi Manajemen Santri dan Pesantren', { exact: false })).toBeVisible();
  });
});

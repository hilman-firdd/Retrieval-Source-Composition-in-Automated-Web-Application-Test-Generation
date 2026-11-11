const { test, expect } = require('@playwright/test');

test.describe('Navigation - Kembali ke beranda dari daftar berita', () => {
  test('kembali ke beranda dari daftar berita', async ({ page }) => {
    await page.goto('/portal/berita');
    await page.getByRole('link', { name: 'Beranda' }).click();

    await expect(page).toHaveURL('/portal');
    await expect(page.getByText('Portal Pesantren PERSIS 27 Situaksan')).toBeVisible();
  });
});

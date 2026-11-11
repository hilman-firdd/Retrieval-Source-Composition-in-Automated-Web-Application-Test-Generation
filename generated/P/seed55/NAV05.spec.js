const { test, expect } = require('@playwright/test');

test.describe('Navigasi - kembali ke beranda dari daftar berita', () => {
  test('kembali ke beranda dari daftar berita', async ({ page }) => {
    await page.goto('/portal/berita');
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();

    await page.click('text=Beranda');
    await expect(page).toHaveURL('/portal');
    await expect(page.getByText('Berita Terbaru - Portal Pesantren PERSIS 27')).toBeVisible();
  });
});

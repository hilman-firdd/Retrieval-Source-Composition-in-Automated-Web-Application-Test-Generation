const { test, expect } = require('@playwright/test');

test.describe('NAV05: Kembali ke beranda dari daftar berita', () => {
  test('Kembali ke beranda dari daftar berita', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await page.getByRole('link', { name: 'Beranda' }).click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/');
    await expect(page.getByText('Portal Pesantren PERSIS 27 Situaksan')).toBeVisible();
  });
});

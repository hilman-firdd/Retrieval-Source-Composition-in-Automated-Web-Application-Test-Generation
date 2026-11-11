const { test, expect } = require('@playwright/test');

test.describe('NAV05: Kembali ke beranda dari daftar berita', () => {
  test('should navigate back to home page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await page.getByRole('link', { name: 'Beranda' }).click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal');
    await expect(page.getByText('Berita Terbaru - Portal Pesantren PERSIS 27')).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NAV04 - Menu navigasi konsisten di seluruh halaman portal', () => {
  test('Menu navigasi konsisten di seluruh halaman portal', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await page.goto('https://staging.pesantrenpersis27.com/portal');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
  });
});

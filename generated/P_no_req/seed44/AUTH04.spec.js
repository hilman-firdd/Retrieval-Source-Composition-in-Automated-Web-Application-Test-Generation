const { test, expect } = require('@playwright/test');

test.describe('AUTH04 - Kembali ke beranda dari halaman login', () => {
  test('kembali ke beranda dari halaman login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Kembali ke Landing Page' })).toBeVisible();
    await page.getByRole('link', { name: 'Kembali ke Landing Page' }).click();

    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
  });
});

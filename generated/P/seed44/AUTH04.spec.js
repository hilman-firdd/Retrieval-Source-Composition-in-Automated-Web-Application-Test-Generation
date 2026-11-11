const { test, expect } = require('@playwright/test');

test.describe('Kembali ke beranda dari halaman login', () => {
  test('kembali ke beranda dari halaman login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('SIMASIS').first()).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible();

    await page.getByRole('link', { name: 'Kembali ke Landing Page' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
  });
});

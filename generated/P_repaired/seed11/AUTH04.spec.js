const { test, expect } = require('@playwright/test');

test.describe('Kembali ke beranda dari halaman login', () => {
  test('kembali ke beranda', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Kembali ke Landing Page' })).toBeVisible();
    await page.locator('#username').fill('pengguna_valid_qa');
    await page.locator('#password').fill('kata-sandi-salah-123');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
  });
});

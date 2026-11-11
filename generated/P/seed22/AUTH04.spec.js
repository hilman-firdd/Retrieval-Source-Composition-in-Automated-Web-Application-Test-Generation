const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - kembali ke beranda', () => {
  test('kembali ke beranda dari halaman login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('SIMASIS').first()).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible();

    await page.locator('#username').fill('pengguna_valid_qa');
    await page.locator('#password').fill('kata-sandi-salah-123');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page).toHaveURL('/portal');
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('AUTH03 - Penolakan kredensial login yang tidak valid', () => {
  test('kredensial yang tidak terdaftar menampilkan pesan kesalahan', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('pengguna_tidak_terdaftar_qa');
    await page.locator('#password').fill('kata-sandi-salah-123');
    await page.getByRole('button', { name: 'Masuk' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('These credentials do not match our records.')).toBeVisible();
  });
});

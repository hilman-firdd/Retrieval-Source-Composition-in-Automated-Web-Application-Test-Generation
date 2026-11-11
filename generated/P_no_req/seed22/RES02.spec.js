const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - berulang dengan kredensial salah', () => {
  test('berulang dengan kredensial salah tidak merusak halaman', async ({ page }) => {
    await page.goto('/login');
    for (let i = 0; i < 3; i++) {
      await page.locator('#username').fill('pengguna_salah_qa');
      await page.locator('#password').fill('kata-sandi-salah-123');
      await page.getByRole('button', { name: 'Masuk' }).click();
      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByText('These credentials do not match our records.')).toBeVisible();
    }
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible();
  });
});

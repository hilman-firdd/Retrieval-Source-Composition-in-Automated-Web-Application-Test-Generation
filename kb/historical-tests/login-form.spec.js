const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - tampilan formulir', () => {
  test('halaman login menampilkan kolom dan tombol yang diperlukan', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('SIMASIS').first()).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible();
  });
});

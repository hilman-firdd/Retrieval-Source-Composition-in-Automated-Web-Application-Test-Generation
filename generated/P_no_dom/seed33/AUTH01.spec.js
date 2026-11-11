const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - Menampilkan formulir login dengan lengkap', () => {
  test('Formulir login lengkap terlihat', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible();
  });
});

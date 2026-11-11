const { test, expect } = require('@playwright/test');

test.describe('AUTH01 - Menampilkan formulir login dengan lengkap', () => {
  test('formulir login terlihat', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('SIMASIS').first()).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible();
  });
});

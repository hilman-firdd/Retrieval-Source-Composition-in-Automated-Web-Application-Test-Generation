const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - kembali ke beranda', () => {
  test('kembali ke beranda dari halaman login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: 'Kembali ke Landing Page' })).toBeVisible();
    await page.getByRole('link', { name: 'Kembali ke Landing Page' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
  });
});

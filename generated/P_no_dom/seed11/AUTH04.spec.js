const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - kembali ke beranda', () => {
  test('kembali ke beranda dari halaman login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('SIMASIS').first()).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible();

    await page.locator('a:has-text("Kembali ke Landing Page")').click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});

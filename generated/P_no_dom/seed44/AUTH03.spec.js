const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - kredensial tidak valid', () => {
  test('penolakan kredensial yang tidak valid', async ({ page }) => {
    await page.goto('/login');
    await page.locator('[data-test-id="username"]').fill('pengguna_tidak_terdaftar_qa');
    await page.locator('[data-test-id="password"]').fill('kata-sandi-salah-123');
    await page.locator('[data-test-id="masuk"]').click();

    await expect(page).toHaveURL('/login');
    await expect(page.locator('[data-test-id="error-message"]').first()).toBeVisible();
  });
});

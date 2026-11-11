const { test, expect } = require('@playwright/test');

test.describe('Login SIMASIS - validasi field kosong', () => {
  test('kiriman kosong ditahan oleh validasi bawaan peramban', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/login/);
    const validationMessage = await page.locator('#username').evaluate((el) => el.validationMessage);
    expect(validationMessage.length).toBeGreaterThan(0);
  });
});

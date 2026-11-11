const { test, expect } = require('@playwright/test');

test.describe('REG04: Mengisi seluruh field wajib pada formulir pendaftaran', () => {
  test('fill required fields and verify', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const phoneInput = page.locator('input[name="phone"]');

    await nameInput.fill('John Doe');
    await emailInput.fill('john.doe@example.com');
    await phoneInput.fill('08123456789');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(phoneInput).toBeVisible();

    await expect(nameInput).toHaveValue('John Doe');
    await expect(emailInput).toHaveValue('john.doe@example.com');
    await expect(phoneInput).toHaveValue('08123456789');

    await expect(page.locator('button[type="submit"]')).not.toBeVisible();
  });
});

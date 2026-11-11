const { test, expect } = require('@playwright/test');

test.describe('REG04 - Mengisi seluruh field wajib pada formulir pendaftaran', () => {
  test('fill required fields and verify', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');

    const nameInput = page.locator('input[data-test-id="name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('John Doe');

    const emailInput = page.locator('input[data-test-id="email"]');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('john.doe@example.com');

    const phoneInput = page.locator('input[data-test-id="phone"]');
    await expect(phoneInput).toBeVisible();
    await phoneInput.fill('08123456789');

    const addressInput = page.locator('input[data-test-id="address"]');
    await expect(addressInput).toBeVisible();
    await addressInput.fill('Jl. Raya No. 1, Jakarta');

    await expect(nameInput).toHaveValue('John Doe');
    await expect(emailInput).toHaveValue('john.doe@example.com');
    await expect(phoneInput).toHaveValue('08123456789');
    await expect(addressInput).toHaveValue('Jl. Raya No. 1, Jakarta');

    await expect(page.locator('button[type="submit"]')).not.toBeVisible();
  });
});

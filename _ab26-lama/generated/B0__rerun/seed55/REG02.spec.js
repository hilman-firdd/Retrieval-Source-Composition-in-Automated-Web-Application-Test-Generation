const { test, expect } = require('@playwright/test');

test.describe('REG02: Formulir pendaftaran menolak kiriman kosong', () => {
  test('Registration form rejects empty submission', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    await expect(page.locator('input[name="nama"]')).toBeVisible();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('input[name="nama"]')).toBeVisible();
    await expect(page.locator('div:has-text("Nama harus diisi")')).toBeVisible();
  });
});

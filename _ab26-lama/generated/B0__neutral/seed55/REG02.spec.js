const { test, expect } = require('@playwright/test');

test.describe('REG02: Formulir pendaftaran menolak kiriman kosong', () => {
  test('should reject empty form submission', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');

    await page.fill('input[name="name"]', '');
    await page.fill('input[name="email"]', '');
    await page.fill('input[name="phone"]', '');
    await page.fill('input[name="address"]', '');

    await page.click('button[type="submit"]');

    await expect(page.locator('input[name="name"]').nth(1)).toBeVisible();
    await expect(page.locator('text="Nama harus diisi"')).toBeVisible();
  });
});

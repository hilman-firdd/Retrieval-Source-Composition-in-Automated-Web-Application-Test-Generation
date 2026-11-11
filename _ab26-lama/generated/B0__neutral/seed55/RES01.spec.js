const { test, expect } = require('@playwright/test');

test.describe('RES01: Formulir menahan masukan yang sangat panjang', () => {
  test('should remain responsive and layout intact', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const namaInput = page.locator('input[name="nama"]');
    await expect(namaInput).toBeVisible();
    await namaInput.fill('a' + new Array(200).join('x'));
    await expect(page.locator('input[name="nama"]').textContent()).toBe('axxxxxx...'); // truncated text
    await expect(page.locator('input[name="nama"]').placeholder()).toBe('Nama');
    await expect(page.locator('button[type="submit"]').textContent()).toBe('Daftar');
    await expect(page.locator('button[type="submit"]').isEnabled()).toBe(true);
  });
});

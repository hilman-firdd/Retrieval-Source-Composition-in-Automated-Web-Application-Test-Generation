const { test, expect } = require('@playwright/test');

test.describe('AUTH04 - Kembali ke beranda dari halaman login', () => {
  test('Kembali ke beranda dari halaman login', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/login');
    await page.getByRole('link', { name: 'Kembali ke Landing Page' }).click();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com');
    await expect(page).toHaveTitle('Pesantren Persis 27 Situaksan Bandung');
  });
});

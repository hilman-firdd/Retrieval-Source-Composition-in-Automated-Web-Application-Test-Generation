const { test, expect } = require('@playwright/test');

test.describe('Navigasi - halaman tidak dikenal', () => {
  test('alamat yang tidak terdaftar menampilkan halaman 404', async ({ page }) => {
    await page.goto('/halaman-tidak-ada-12345');
    await expect(page).toHaveTitle(/Not Found/i);
    await expect(page.getByText('404').first()).toBeVisible();
  });
});

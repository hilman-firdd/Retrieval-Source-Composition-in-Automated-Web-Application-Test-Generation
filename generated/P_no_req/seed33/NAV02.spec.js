const { test, expect } = require('@playwright/test');

test.describe('Berpindah dari beranda ke daftar berita', () => {
  test('berpindah ke daftar berita', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Semua Berita').click();
    await expect(page).toHaveURL('/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
  });
});

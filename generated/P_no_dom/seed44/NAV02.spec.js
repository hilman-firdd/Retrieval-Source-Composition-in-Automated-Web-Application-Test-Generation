const { test, expect } = require('@playwright/test');

test.describe('Berpindah dari beranda ke daftar berita', () => {
  test('beranda menuju daftar berita', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Info Terbaru' })).toBeVisible();
    await page.getByRole('link', { name: 'Info Terbaru' }).click();
    await expect(page).toHaveURL('/portal/berita');
    await expect(page.getByRole('heading', { name: 'Berita Terbaru' })).toBeVisible();
  });
});

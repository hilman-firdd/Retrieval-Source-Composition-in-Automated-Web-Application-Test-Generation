const { test, expect } = require('@playwright/test');

test.describe('Berpindah dari beranda ke daftar artikel santri', () => {
  test('berpindah ke daftar artikel santri', async ({ page }) => {
    await page.goto('/');
    await page.locator('a', { name: 'Pesantren Persis 27 Situaksan Bandung Gelar Agenda Wisata "Goes to Pangandaran"' }).click();
    await expect(page).toHaveURL('/portal/artikel');
    await expect(page.getByRole('heading', { name: 'Artikel Santri - Portal Pesantren PERSIS 27' })).toBeVisible();
  });
});

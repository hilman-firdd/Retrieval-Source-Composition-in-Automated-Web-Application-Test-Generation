const { test, expect } = require('@playwright/test');

test.describe('NAV02 - Berpindah dari beranda ke daftar berita', () => {
  test('Berita Terbaru', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/berita');
  });
});

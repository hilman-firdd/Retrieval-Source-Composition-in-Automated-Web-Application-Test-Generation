const { test, expect } = require('@playwright/test');

test.describe('NAV02 - Berpindah dari beranda ke daftar berita', () => {
  test('should navigate to berita page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
    await page.click('text="Berita Terbaru"');
    await expect(page).toHaveURL('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.getByText('Berita Terbaru')).toBeVisible();
  });
});

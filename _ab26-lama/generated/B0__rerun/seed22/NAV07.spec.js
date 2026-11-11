const { test, expect } = require('@playwright/test');

test.describe('NAV07: Membuka halaman galeri dan memverifikasi konten visual', () => {
  test('Verify galeri page and visual content', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await page.click('text=Galeri');
    await expect(page.locator('text=Galeri')).toBeVisible();
    await expect(page.locator('text=Galeri')).toHaveAttribute('href', '/galeri');
    await expect(page.locator('text=Galeri')).toBeVisible();
    await expect(page.locator('role=image')).toBeVisible();
  });
});

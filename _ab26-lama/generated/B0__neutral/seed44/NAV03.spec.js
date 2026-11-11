const { test, expect } = require('@playwright/test');

test.describe('NAV03: Berpindah dari beranda ke halaman program pendidikan', () => {
  test('Verify program education page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await expect(page.locator('text=Program Pendidikan')).toBeVisible();
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/program-pendidikan');
  });
});

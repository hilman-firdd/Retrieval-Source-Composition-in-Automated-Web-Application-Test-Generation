const { test, expect } = require('@playwright/test');

test.describe('NEWS05: Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('Search news with keyword "santri" and verify results', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('input[name="q"]').first()).toBeVisible();
    await page.locator('input[name="q"]').first().fill('santri');
    await page.locator('input[name="q"]').first().press('Enter');
    await expect(page.locator('a:has-text("santri")')).toBeVisible();
    await expect(page).toHaveURL(/.*search\/santri\/?/);
  });
});

const { test, expect } = require('@playwright/test');

test.describe('NEWS05 - Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('Pencarian berita dengan kata kunci yang ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('input[name="q"]').first()).toBeVisible();
    await page.locator('input[name="q"]').first().fill('santri');
    await page.locator('input[name="q"]').first().press('Enter');
    await expect(page.url()).toBe('https://staging.pesantrenpersis27.com/portal/berita?search=santri');
    await expect(page.locator('text="Berita"').first()).toBeVisible();
  });
});

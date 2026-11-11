const { test, expect } = require('@playwright/test');

test.describe('NEWS05: Pencarian berita dengan kata kunci yang ada hasilnya', () => {
  test('Pencarian berita dengan kata kunci yang ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/berita');
    await expect(page.locator('input[name="q"]').first()).toBeVisible();
    await page.fill('input[name="q"]', 'santri');
    await page.keyboard.press('Enter');
    await expect(page.locator('a:has-text("Santri")').first()).toBeVisible();
    await expect(page).toHaveURL(/.*search=.*santri.*/);
  });
});

const { test, expect } = require('@playwright/test');

test.describe('ARTC04: Pencarian artikel dengan kata kunci yang tidak ada hasilnya', () => {
  test('Pencarian artikel dengan kata kunci yang tidak ada hasilnya', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/artikel');
    await expect(page.locator('input[name="q"]').fill('katakuncitidakada')).waitForTimeout();
    await expect(page.locator('button[type="submit"]').click()).toBeVisible();
    await expect(page.locator('div.result-list')).not.toBeVisible();
    await expect(page.locator('div.result-list')).not.toBeVisible();
  });
});

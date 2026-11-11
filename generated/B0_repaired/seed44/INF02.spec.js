const { test, expect } = require('@playwright/test');

test.describe('INF02: Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', () => {
  test('Verify FAQ SIMASIS page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');
    const question = page.locator('text="1. Apa itu SIMASIS?"');
    await expect(question).toBeVisible();
    const answer = question.locator('following-sibling::text');
    await expect(answer).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test.describe('INF02: Membaca FAQ SIMASIS tanpa perlu mengeklik akordeon', () => {
  test('Verify FAQ SIMASIS page', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/faq-simasis');
    const questionLocator = page.locator('text="1. Apa itu SIMASIS?"');
    await expect(questionLocator).toBeVisible();
    const answerLocator = page.locator('text="Jawaban: ..."');
    await expect(answerLocator).toBeVisible();
  });
});

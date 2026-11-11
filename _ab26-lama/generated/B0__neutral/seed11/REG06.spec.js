const { test, expect } = require('@playwright/test');

test.describe('REG06: Daftar pilihan jenjang pendidikan tersedia dan dapat dipilih', () => {
  test('Daftar pilihan memiliki lebih dari satu opsi', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const options = page.locator('select option');
    await expect(options).toBeVisible();
    await expect(options).toBeMultiple();
  });

  test('Opsi yang dipilih tercatat pada field', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const options = page.locator('select option');
    await expect(options).toBeVisible();
    await page.selectOption('select', 'option-1'); // Replace with actual option value
    const selectedOption = page.locator('select option:checked');
    await expect(selectedOption).toBeVisible();
  });
});

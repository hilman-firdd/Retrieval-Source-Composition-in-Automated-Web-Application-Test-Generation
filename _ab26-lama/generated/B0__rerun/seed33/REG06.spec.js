const { test, expect } = require('@playwright/test');

test.describe('REG06: Daftar pilihan jenjang pendidikan tersedia dan dapat dipilih', () => {
  test('Daftar pilihan memiliki lebih dari satu opsi', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const options = await page.locator('select').getByTestId('education-level');
    expect(options).toBeVisible();
    expect(options).toHaveMoreThan(1);
  });

  test('Opsi yang dipilih tercatat pada field', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const options = await page.locator('select').getByTestId('education-level');
    await options.selectOption(1);
    const selectedOption = await page.locator('input[name="education-level"]').getValue();
    expect(selectedOption).toBe('Pilihan 1');
  });
});

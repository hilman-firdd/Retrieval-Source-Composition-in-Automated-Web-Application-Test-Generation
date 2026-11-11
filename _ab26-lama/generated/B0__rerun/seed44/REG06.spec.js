const { test, expect } = require('@playwright/test');

test.describe('REG06: Daftar pilihan jenjang pendidikan tersedia dan dapat dipilih', () => {
  test('Daftar pilihan memiliki lebih dari satu opsi', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const options = await page.locator('select').getByRole('option');
    expect(options).toHaveMoreThan(1);
  });

  test('Opsi yang dipilih tercatat pada field', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const select = await page.locator('select');
    await select.selectOption('option[1]'); // Select the first option
    const selectedOption = await select.selectOption();
    expect(selectedOption).toBeVisible();
  });
});

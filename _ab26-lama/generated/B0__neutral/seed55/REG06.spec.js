const { test, expect } = require('@playwright/test');

test.describe('REG06: Daftar pilihan jenjang pendidikan tersedia dan dapat dipilih', () => {
  test('Daftar pilihan memiliki lebih dari satu opsi', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const options = await page.$$('.form-check');
    expect(options.length).toBeGreaterThan(1);
  });

  test('Opsi yang dipilih tercatat pada field', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const options = await page.$$('.form-check');
    await options[0].click();
    const selectedOption = await page.$('input[name="jenjang_pendidikan"]:checked');
    expect(selectedOption).toBeVisible();
  });
});

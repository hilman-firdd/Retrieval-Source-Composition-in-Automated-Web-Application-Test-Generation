const { test, expect } = require('@playwright/test');

test.describe('REG06: Daftar pilihan jenjang pendidikan tersedia dan dapat dipilih', () => {
  test('Pilihan jenjang pendidikan tersedia', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const pilihanJenjang = page.locator('select[name="jenjang"]');
    await expect(pilihanJenjang).toBeVisible();
    await expect(pilihanJenjang).toBeOptionCountGreaterThan(1);
  });

  test('Opsi yang dipilih tercatat pada field', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/pendaftaran');
    const pilihanJenjang = page.locator('select[name="jenjang"]');
    await pilihanJenjang.selectOption('S1');
    const fieldJenjang = page.locator('input[name="jenjang"]');
    await expect(fieldJenjang).toBeVisible();
    await expect(fieldJenjang).toHaveValue('S1');
  });
});

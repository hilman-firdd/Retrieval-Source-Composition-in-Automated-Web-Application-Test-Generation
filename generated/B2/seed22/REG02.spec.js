const { test, expect } = require('@playwright/test');

test.describe('REG02 - Memverifikasi tautan ke formulir eksternal tanpa mengisinya', () => {
  test('Verify "Buka di tab baru" link', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-khusus');
    await expect(page.getByRole('link', { name: 'Buka di tab baru' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Buka di tab baru' })).toHaveAttribute('href', 'https://docs.google.com/forms/d/e/1FAIpQLSdX5VEr5ywd0nV4c4b5soUKS-f6oYpwVLf-2ihrwAup8xnFLA/viewform?embedded=true');
  });
});

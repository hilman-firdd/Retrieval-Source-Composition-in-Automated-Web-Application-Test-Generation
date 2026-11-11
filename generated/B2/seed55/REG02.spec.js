const { test, expect } = require('@playwright/test');

test.describe('REG02 - Memverifikasi tautan ke formulir eksternal tanpa mengisinya', () => {
  test('Verify the link to the external form', async ({ page }) => {
    await page.goto('https://staging.pesantrenpersis27.com');
    await page.goto('https://staging.pesantrenpersis27.com/portal/halaman/pendaftaran-khusus');

    const link = await page.getByRole('link', { name: 'Buka di tab baru' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://docs.google.com/forms/d/e/1FAIpQLSdX5VEr5ywd0nV4c4b5soUKS-f6oYpwVLf-2ihrwAup8xnFLA/viewform?embedded=true');
  });
});

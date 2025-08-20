import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Import Flow', () => {
  const sampleFilePath = path.join(__dirname, 'fixtures/sample-transactions.csv');

  test('should allow a user to upload a CSV and import transactions', async ({ page }) => {
    // 1. Navigate to the main page and upload the file
    await page.goto('/');

    // The DataInput component should be visible
    await expect(page.getByText('Upload a file or connect to your database.')).toBeVisible();

    // Find the file input and upload the sample file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByLabel('Upload File').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(sampleFilePath);

    // 2. Review and confirm the import
    // The ImportPage should now be visible
    await expect(page.getByRole('heading', { name: 'Review & Import Transactions' })).toBeVisible();

    // Check if the transactions from the CSV are in the table
    await expect(page.getByText('Coffee Shop')).toBeVisible();
    await expect(page.getByText('Salary')).toBeVisible();
    await expect(page.getByText('Groceries')).toBeVisible();

    // Click the save button
    await page.getByRole('button', { name: /Save Selected/ }).click();

    // 3. Verify transactions are saved
    // Should be redirected to the dashboard first
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Navigate to the transactions page
    await page.getByRole('button', { name: 'Transactions' }).click();
    await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();

    // Check if the imported transactions are in the main table
    await expect(page.getByText('Coffee Shop')).toBeVisible();
    await expect(page.getByText('Salary')).toBeVisible();
    await expect(page.getByText('Groceries')).toBeVisible();
  });
});

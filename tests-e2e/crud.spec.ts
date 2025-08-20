import { test, expect } from '@playwright/test';

test.describe('Transaction CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // For CRUD tests, we need to start from a known state.
    // Let's assume the DB is seeded and we can navigate to the transactions page.
    await page.goto('/');
    // First, we need to get past the initial data loading screen.
    // A button "Fetch from DB" or similar should exist.
    await page.getByRole('button', { name: 'Fetch From DB' }).click();
    // Now, navigate to the transactions page.
    await page.getByRole('button', { name: 'Transactions' }).click();
    await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
  });

  test('should allow adding, editing, and deleting a transaction', async ({ page }) => {
    // --- CREATE ---
    await page.getByRole('button', { name: 'Add Transaction' }).click();

    // The modal should appear
    await expect(page.getByRole('heading', { name: 'Transaction' })).toBeVisible();

    // Fill the form
    await page.getByLabel('Date').fill('2024-08-21');
    await page.getByLabel('Description').fill('Test Transaction');
    await page.getByLabel('Amount').fill('123.45');
    // For category and account, we might need to select from a dropdown.
    // This assumes 'General' category and 'Checking' account exist from seeded data.
    await page.getByLabel('Category').selectOption({ label: 'General' });
    await page.getByLabel('Account').selectOption({ label: 'Checking' });

    await page.getByRole('button', { name: 'Save' }).click();

    // Verify the new transaction is in the table
    await expect(page.getByText('Test Transaction')).toBeVisible();
    await expect(page.getByText('123.45')).toBeVisible();

    // --- EDIT ---
    // Find the row with the new transaction and click its edit button
    const newTransactionRow = page.locator('tr', { hasText: 'Test Transaction' });
    await newTransactionRow.getByRole('button', { name: 'Edit' }).click();

    // The modal should appear again
    await expect(page.getByRole('heading', { name: 'Transaction' })).toBeVisible();

    // Edit the description and amount
    await page.getByLabel('Description').fill('Edited Test Transaction');
    await page.getByLabel('Amount').fill('543.21');

    await page.getByRole('button', { name: 'Save' }).click();

    // Verify the changes are reflected
    await expect(page.getByText('Edited Test Transaction')).toBeVisible();
    await expect(page.getByText('543.21')).toBeVisible();
    await expect(page.getByText('Test Transaction')).not.toBeVisible();

    // --- DELETE ---
    // Find the row again and click delete
    const editedTransactionRow = page.locator('tr', { hasText: 'Edited Test Transaction' });

    // Handle the confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    await editedTransactionRow.getByRole('button', { name: 'Delete' }).click();

    // Verify the transaction is no longer in the table
    await expect(page.getByText('Edited Test Transaction')).not.toBeVisible();
  });
});

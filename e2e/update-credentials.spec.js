// e2e/update-credentials.spec.js
import { test, expect } from '@playwright/test';

// Reuse saved login session from storage
test.use({ storageState: 'storage-state.json' });

test('updates email and password after Google login', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // ✅ Check user is logged in
  await expect(page.getByText('Welcome')).toBeVisible();

  // 💌 Fill in new email
  await page.getByPlaceholder('New email').fill('lakshmivaddi4455@gmail.com');
  await page.getByRole('button', { name: 'Update Email' }).click();

  // ⏳ Wait for confirmation message
  await expect(page.getByText(/Email update requested/i)).toBeVisible();

  // 🔑 Fill in new password
  await page.getByPlaceholder('New password').fill('mohan@1234');
  await page.getByRole('button', { name: 'Update Password' }).click();

  // ⏳ Wait for password update confirmation
  await expect(page.getByText(/Password updated successfully/i)).toBeVisible();

  console.log('✅ Email and password update flow completed.');
});

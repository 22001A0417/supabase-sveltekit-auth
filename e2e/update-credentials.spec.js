import { test, expect, chromium } from '@playwright/test';

test('updates email and password after Google login', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: 'auth.json' });
  const page = await context.newPage();

  await page.goto('http://localhost:5173');

  // ✅ Check user is logged in
  await expect(page.getByText('Welcome')).toBeVisible();

  // 💌 Fill in new email
  const newEmail = `user${Date.now()}@example.com`;
  await page.getByPlaceholder('New email').fill(newEmail);
  await page.getByRole('button', { name: 'Update Email' }).click();

  // ⏳ Wait for confirmation message
  await expect(page.getByText(/Email update requested/i)).toBeVisible();

  // 🔑 Fill in new password
  await page.getByPlaceholder('New password').fill('MyNewStrongPassword123');
  await page.getByRole('button', { name: 'Update Password' }).click();

  // ⏳ Wait for password update confirmation
  await expect(page.getByText(/Password updated successfully/i)).toBeVisible();

  await browser.close();
});

// e2e/use-saved-login.spec.js
import { test, expect } from '@playwright/test';

test.use({ storageState: 'storage-state.json' }); // Reuse saved login session

test('reuses saved login session', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page.locator('text=Welcome')).toBeVisible();

  console.log('✅ Reused session successfully, Welcome message found');
});

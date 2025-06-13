// e2e/use-saved-login.spec.js
import { test, expect, chromium } from '@playwright/test';

test('reuses saved login session', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'auth.json' });

  const page = await context.newPage();
  await page.goto('http://localhost:5173');

  await expect(page.locator('text=Welcome')).toBeVisible();

  await browser.close();
});
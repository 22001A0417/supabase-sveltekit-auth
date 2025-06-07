// e2e/save-login.spec.js
import { test, chromium } from '@playwright/test';

test('login manually and save session', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:5173');

  await page.click('text=Login with Google');
  await page.waitForURL('https://accounts.google.com/**');

  console.log('🔒 Please complete the login manually...');
  await page.waitForSelector('text=Welcome', { timeout: 120_000 });

  await context.storageState({ path: 'auth.json' });
  console.log('✅ Session saved to auth.json');
  await browser.close();
});

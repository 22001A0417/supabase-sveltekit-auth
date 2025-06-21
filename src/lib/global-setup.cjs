const { chromium } = require('playwright'); // ✅ Pure Playwright
const fs = require('fs');
const path = require('path');
const UserAgent = require('user-agents');
require('dotenv').config();

// Generate a realistic user agent for Chrome on Windows
const ua = new UserAgent({ platform: 'Win32', deviceCategory: 'desktop' });

module.exports = async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-web-security',
      '--disable-infobars',
      '--disable-extensions',
      '--start-maximized',
      '--window-size=1280,720'
    ]
  });

  const context = await browser.newContext({
    userAgent: ua.toString(),
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Navigate to your app
  await page.goto('http://localhost:5173');

  // Trigger Google login
  await page.click('text=Sign in with Google');

  // Wait for Google login page
  await page.waitForURL(/accounts\.google\.com/);

  // Fill Google login form
  await page.fill('input[type="email"]', process.env.USER_LOGIN);
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(2000); // adjust if needed

  await page.fill('input[type="password"]', process.env.USER_PASS);
  await page.click('button:has-text("Next")');

  // Wait for redirect back to your app
  await page.waitForURL(/localhost:5173/); // change if your redirect domain is different

  // Save logged-in session state
  await context.storageState({ path: path.resolve('./storage-state.json') });

  await browser.close();
};

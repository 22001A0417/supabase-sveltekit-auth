import { defineConfig } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // Start the app before running tests
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  // Location of your end-to-end tests
  testDir: 'e2e',

  // Global setup to login and save session
  globalSetup: './src/lib/global-setup.cjs',

  // Default settings for all tests
  use: {
    storageState: path.resolve('./storage-state.json'), // Load saved session
    headless: false, // Needed for Google login
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    permissions: ['geolocation'],

    // 🔥 Capture every test run
    screenshot: 'only-on-failure',
    video: 'on', 
  },

  // Use Google Chrome as browser
  projects: [
    {
      name: 'Google Chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome', // Use actual Chrome
        headless: false,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--no-sandbox',
          '--disable-web-security',
          '--disable-infobars',
          '--disable-extensions',
          '--start-maximized',
          '--window-size=1280,720',
        ],
      },
    },
  ],

  // Store videos and screenshots
  outputDir: 'test-results/',
});

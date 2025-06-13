import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'e2e',
	projects: [
		{
			name: 'chrome',
			use: {
				browserName: 'chromium',
				channel: 'chrome',           // 🔥 Use full Chrome
				headless: false,             // Show browser
				ignoreHTTPSErrors: true,     // In case Google login complains about SSL
				permissions: ['geolocation'], // Optional: enable permissions if needed
			}
		}
	]
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests_ui',
  fullyParallel: false, // Prevents resource clashing on GitHub free runners
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }], // The deep-dive report (2.5)
    ['json', { outputFile: '../playwright-report/results.json' }] // For our aggregator (2.4)
  ],
  use: {
    baseURL: 'https://automationintesting.online/', // Example target site
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
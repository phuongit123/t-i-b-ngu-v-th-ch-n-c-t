import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.AFFINITY_E2E_PORT || 5173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid E2E port');
const localUrl = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: localUrl,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npx vite --host 127.0.0.1 --port ${port} --strictPort`,
    url: localUrl,
    reuseExistingServer: true,
    timeout: 10000,
  },
  projects: [
    ...(process.env.AFFINITY_CROSS_BROWSER === '1' ? [
      { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
      { name: 'webkit', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
    ] : []),
    {
      name: 'msedge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});

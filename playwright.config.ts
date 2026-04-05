import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E テスト設定
 * 実行前に `npm run dev` または `npm run build && npm run start` でサーバーを起動しておく。
 * CI では webServer を使って自動起動する。
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // CI 環境では Next.js をビルド済みプロセスとして起動
  webServer: process.env.CI
    ? {
        command: 'npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        timeout: 60_000,
      }
    : undefined,
});

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['lib/**/*.test.ts', 'app/**/*.test.ts'],
    exclude: ['everything-claude-code/**', 'node_modules/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});

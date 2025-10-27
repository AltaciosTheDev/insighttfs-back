// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'jsdom' if testing frontend
//    setupFiles: './src/test/setup.ts', // optional
  },
})
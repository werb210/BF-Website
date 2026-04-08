import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: [
      'node_modules',
      'dist',
      '.git',
      'tests',
      '__tests__'
    ],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts']
  }
})

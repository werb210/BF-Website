import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,

    // CRITICAL: reduce file count
    cssCodeSplit: false,

    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
      }
    },

    // CRITICAL: prevent asset fragmentation
    assetsInlineLimit: 100000000,

    chunkSizeWarningLimit: 1000
  }
})

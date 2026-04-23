import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../../../../dist/distribution_center',
    emptyOutDir: true,
    rollupOptions: {
      input: './javascript/distribution_center.js',
      output: {
        entryFileNames: 'distribution_center.js',
        assetFileNames: 'distribution_center.js'
      }
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      '.gitpod.dev',
      'localhost',
      '127.0.0.1',
      '.eu-runner.flex.doptig.cloud',
      '.sales-emea.flex.doptig.cloud',
      '.sales-us.flex.doptig.cloud',
      '.gcp-demo-runner.flex.doptig.cloud'
    ]
  },
  css: {
    postcss: './postcss.config.js'
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/main.jsx',
        '**/*.config.js',
        'coverage/**'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
}) 

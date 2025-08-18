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
      '.sales-emea.flex.doptig.cloud',
      '.sales-us.flex.doptig.cloud',
      '.gcp-demo-runner.flex.doptig.cloud'
    ]
  },
  css: {
    postcss: './postcss.config.js'
  }
}) 

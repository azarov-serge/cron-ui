import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/cron-ui/',
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  plugins: [
    command === 'serve' ? basicSsl() : undefined,
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        replaceAttrValues: {
          '#000': 'currentColor',
        },
      },
    }),
  ].filter(Boolean),
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
}))

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // The Express API has no CORS setup, so API calls go through this proxy.
  const proxy = {
    '/api': {
      target: env.VITE_API_TARGET || 'http://localhost:3000',
      changeOrigin: true,
    },
  }
  return {
    plugins: [react(), tailwindcss()],
    server: { port: 5173, proxy },
    preview: { proxy },
  }
})

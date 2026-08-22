import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Docker Compose maps backend to host port 8088 (see docker-compose.yml)
        target: 'http://localhost:8088',
        changeOrigin: true,
      },
    },
  },
})

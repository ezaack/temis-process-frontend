import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // This makes the server accessible on your local network
    port: 3000,       // Default port, change if needed
    watch: {
      usePolling: true,
      interval: 100
    },
    hmr: true          // Hot module replacement for live reloads
  }
  
}) 
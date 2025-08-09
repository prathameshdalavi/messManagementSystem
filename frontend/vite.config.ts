import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // listen on all addresses so LAN/tunnel can reach
    port: 5173,
    proxy: {
      // Forward API calls to backend so browser only talks to frontend origin
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }, 
    allowedHosts : ['cold-meals-sin.loca.lt']
  }
})

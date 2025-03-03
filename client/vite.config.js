import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'real-estate-app-tunnel-fabqxc3h.devinapps.com',
      'localhost'
    ]
  }
})

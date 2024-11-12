import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Replace with your backend server URL
        changeOrigin: true,
        secure: false, // Set to true if you want SSL verification for HTTPS
      },
    },
  },
})

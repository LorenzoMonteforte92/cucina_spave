import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Se pubblichi su GitHub Pages sotto /<repo>/, imposta base: '/<repo>/'
  // base: '/cucina-spave/'
})

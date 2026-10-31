import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' gör att appen fungerar från en undermapp, t.ex. på GitHub Pages
export default defineConfig({
  base: './',
  plugins: [react()],
})

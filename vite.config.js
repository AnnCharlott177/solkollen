import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' gör att appen fungerar från en undermapp, t.ex. på GitHub Pages
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // En låtsasnyckel så att testerna aldrig behöver en riktig. Alla anrop till API:et mockas.
    env: { VITE_OPENWEATHER_API_KEY: 'testnyckel' },
  },
})

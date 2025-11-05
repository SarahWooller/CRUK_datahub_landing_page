// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const repoName = 'CRUK_datahub_landing_page'

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,

  build: {
    rollupOptions: {
      input: {
        // Map a name (key) to the path (value) for each HTML file
        // The path must be absolute, which 'resolve' helps create.
        main_vert_bar: resolve(__dirname, 'vert_bar.html'), // Assuming a.html is at the root
        main_top_bar: resolve(__dirname, 'top_bar.html'), // Assuming b.html is at the root
      },
    },
  },
})
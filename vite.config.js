// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react({
    // FIX: Changed "{jsx.js}" to "{jsx,js}" for correct syntax
    include: "**/*.{jsx,js}",
  })],
  base: "./",

  build: {
    outDir: "docs",
    emptyOutDir: true, // Added for clean builds (recommended)
    rollupOptions: {
      input: {
        // FIX: The main index.html is now resolved from the root.
        main: resolve(__dirname, 'index.html'),

        // The remaining entry points are still in src/.
        // FIX: Removed leading slash '/' from these paths.
        vert_bar: resolve(__dirname, 'src/vert_bar.html'),
        top_bar: resolve(__dirname, 'src/top_bar.html'),
        alt_studies: resolve(__dirname, 'src/alt_studies.html')
        just_vert_bar: resolve(__dirname, 'src/just_vert_bar.html'),
        upload: resolve(__dirname, 'src/upload.html'),
      },
    },
  },
})
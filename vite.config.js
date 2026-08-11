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
    assetsDir: "assets",
    emptyOutDir: true, // Added for clean builds (recommended)
    rollupOptions: {
      input: {
        // FIX: The main index.html is now resolved from the root.
        main: resolve(__dirname, 'index.html')
      },
    },
  },
})
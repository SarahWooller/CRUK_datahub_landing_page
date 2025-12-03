// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const repoName = 'CRUK_datahub_landing_page'

export default defineConfig({
  plugins: [react({
    include: "**/*.{jsx.js}",
    })],
  base: "./",

  build: {
    outDir: "docs",
    rollupOptions: {
      input: {
        // Map a name (key) to the path (value) for each HTML file
        // The path must be absolute, which 'resolve' helps create.
        main: resolve(__dirname, "index.html"),
        vert_bar: resolve(__dirname, 'vert_bar.html'),
        top_bar: resolve(__dirname, 'top_bar.html'),
        just_vert_bar: resolve(__dirname, 'just_vert_bar.html'),
        metadata: resolve(__dirname, 'metadata.html'),
        upload: resolve(__dirname, 'upload.html'),
      },
    },
  },
})
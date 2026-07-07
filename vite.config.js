// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react({
    // FIX: Changed "{jsx.js}" to "{jsx,js}" for correct syntax
    include: "**/*.{jsx,js}",
  })],
  // FIX: Changed base from "./" to "/" to resolve MIME type errors on nested routes
  base: "/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true, // Added for clean builds (recommended)
    rollupOptions: {
      input: {
        // FIX: The main index.html is now resolved from the root.
        main: resolve(__dirname, 'index.html'),

        // The remaining entry points are still in src/.
        // FIX: Removed leading slash '/' from these paths.
        about: resolve(__dirname, 'src/about.html'),
        meta: resolve(__dirname, 'src/meta.html'),
        project_meta: resolve(__dirname, 'src/project_meta.html'),
        protect_data: resolve(__dirname, 'src/protect_data.html'),
        publications: resolve(__dirname, 'src/publications.html'),
        projects: resolve(__dirname, 'src/projects.html'),
        datasets: resolve(__dirname, 'src/datasets.html'),
        sign_in: resolve(__dirname, 'src/sign_in.html'),
        upload: resolve(__dirname, 'src/upload.html'),
        upload_project: resolve(__dirname, 'src/upload_project.html'),
        upload_publications: resolve(__dirname, 'src/upload_publications.html'),
        dashboard: resolve(__dirname, 'src/dashboard.html'),
        test: resolve(__dirname, 'src/test.html'),
      },
    },
  },
})
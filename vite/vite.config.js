// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'repo-name' with the actual name of your GitHub repository
const repoName = 'CRUK_datahub_landing_page'

export default defineConfig({
  plugins: [react()],
  // 🔑 Crucial step for GitHub Pages
  base: `/${repoName}/`,
})
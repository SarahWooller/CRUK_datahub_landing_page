These are design pages to inform the build of the CRUK pilot datahub
They are react html webpages that should be run using npm/vite.

# Running the pages
To do this we take the following steps
1) Install Node.js
2) in the directory above vite initialize npm:
`npm init -y`
3) install vite
`npm install vite @vitejs/plugin-react react react-dom --save-dev`
This will install a package.json and package-lock.json which you dont need
and a node_modules directory which you do and should be placed in the vite directory.
4) navigate to vite
5) Run the http://localhost:5173  using `npm run dev` and navigate to top_bar.html
   (others to follow)
6) critically this should give you a directory full of node modules in the vite directory. 
7) If they arent there you'll have to move them. 
8) run `npm run build` to update the github io pages. This builds to the directory docs (which you can clear out first).


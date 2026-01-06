This project is a series of pages to inform the design of the new CRUK pilot metadata hub.
It is built in react and run using npm/vite.
The most uptodate version can be viewed on my github.io pages
http://sarahwooller.github.io/CRUK_datahub_landing_page

 ### Viewing and Using Locally 
1) Install Node.js
2) in the directory above vite initialize npm:
`npm init -y`
3) install vite
`npm install vite @vitejs/plugin-react react react-dom --save-dev`
This will install a package.json and package-lock.json which you dont need
and a node_modules directory which you do and should be placed in the vite directory.
4) navigate to vite
5) Run the http://localhost:5173  using `npm run dev`
8) To update on github I've used 
9) run `npm run build` to build to the docs folder (specified in vite.config.js). 
10) To check everything is running nicely before committing to github you can then head over to docs and use 
`npx http-server`

### The Structure of the pages
The pages are built from index.html which create a root for ./src/main.jsx to spin out links from.

each of these pages takes the same form - a basic html page with identified divs and a corresponding _vite.jsx page 
that links the html page to its corresponding components.


top_bar.html is a react html webpage that should be run using npm/vite.
To do this we take the following steps
1) Install Node.js

2) in the directory above vite initialize npm:
`npm init -y`
3) install vite
`npm install vite @vitejs/plugin-react react react-dom --save-dev`
This will install a package.json and package-lock.json which you dont need
and a node_modules directory which you do and should be placed in the vite directory.
4) navigate to vite

5) Run the http://localhost:5173  using `npm run dev`
8) The versions that are hosted on github.io first have to be built using 
9) `npm run build`
10) At present this gives incorrect hrefs in the assets, so to change them 
11) you do
12) `cd ..\`
13) `python move_refs.py`
14) any new files can then be added to git and committed.

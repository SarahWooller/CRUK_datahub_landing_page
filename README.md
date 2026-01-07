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

##### Study Browser

alt_studies.html
-    alt_studies_vite.jsx
  - import { Introduction } from './components/Introduction.jsx' 
  - import { FilterApp } from './components/HorFilterApp.jsx' 
    - import { filterDetailsMap, filterData } from '../utils/filter-setup'; 
      - import { filterData } from './longer_filter_data.js';
    - import { filterType, includeParents, plusParents, getMessage, calculateLogicMessage
        } from '../utils/logic-utils'; 
      - import { filterDetailsMap } from './filter-setup.js';
        - import { filterData } from './longer_filter_data.js';
    - import { executeFilterLogic } from '../utils/filterLogic.js'; 
      - import { filterData } from './longer_filter_data.js'; 
      - import { studyData } from './mock_study_data.js';
    - import "../styles/style.css"
  - import { Header } from './components/Header.jsx' 
    - import "../styles/style.css"
  - import { StudiesSection } from './components/AltStudiesSection.jsx'

###### Page for uploading data

- upload.html
  - upload_vite.jsx
    - import SchemaPage from './components/SchemaPage2.jsx'; 
      - import schema from '../utils/schema.json';
      - import DataTagger, { FilterChipArea } from './DataTagger';
        - import { filterDetailsMap, filterData } from '../utils/filter-setup';
          - import { filterData } from './longer_filter_data.js';
        - import "../styles/style.css"
      - import JsonUpload from './JsonUpload'; 
      - import UploadTopBar from './UploadTopBar'; 
      - import { filterData } from '../utils/filter-setup';
        - import exampleData from '../utils/example_for_download.json';

    - import { Header } from './components/Header.jsx'
      - import "../styles/style.css"

##### Page for displaying data

- meta.html
  - meta_vite.jsx
    - import mammogramData from '../utils/mammogram.json'; 
    - import animalIcon from '../assets/animal.webp';
    - import backgroundIcon from '../assets/background.webp';
    - import biobankIcon from '../assets/biobank.webp';
    - import invitroIcon from '../assets/invitro.webp';
    - import longitudinalIcon from '../assets/longitudinal.webp';
    - import treatmentsIcon from '../assets/treatments.webp';
    - import omicsIcon from '../assets/omics.webp';
    - import imagingIcon from '../assets/medical_imaging.webp';
    - import labResultsIcon from '../assets/lab_results.webp';
    - import erdImage from '../assets/erd.png';




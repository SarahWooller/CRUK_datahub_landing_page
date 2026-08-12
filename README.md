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


### Automatic Dataset Filter Injection

When uploading or editing a dataset schema (e.g., in `SchemaPage.jsx`), the system automatically maps and injects relevant CRUK and TCGA terms into the `datasetFilters` array before the data is saved.

### AI Chatbot (ChatWidget)

The landing page features a floating AI chatbot widget (`ChatWidget.jsx`) that helps users query datasets and projects:
- **Persistent Memory**: The chat history is saved in `sessionStorage` so users can click on suggested datasets, navigate to new pages, and retain their chat context.
- **Rich Formatting**: Responses are formatted using `react-markdown`.
- **Invisible Bot Protection**: Integrates Cloudflare Turnstile to generate secure tokens and protect the backend AI from automated abuse.
- **Action Buttons**: The AI automatically generates "View Dataset" or "View Project" buttons based on matched database records to guide the user seamlessly.

**How it works:**
1. **Extraction**: Just before saving, the frontend extracts any user-selected Topography tags (IDs starting with `"0_0_0"`) and Histology tags (IDs starting with `"0_0_1"`).
2. **Interrogation**: If both are present, it sends a `POST` request to the backend endpoint (`/datasets/extra-terms`) containing the selected tags.
3. **Appending**: The backend processes this and returns a `lookupMap` of corresponding CRUK and TCGA dataset filters. The frontend then dynamically merges these new extra terms into the final dataset payload.

### Boolean Filter Search System

The Study Browser implements a programmatic filter engine (`filterLogic.js`) that allows for complex boolean querying:
- **Infix to Prefix**: The user's visual selections (e.g., `(Breast AND Cancer) OR Genomics`) are parsed into an infix string, which the engine converts into a recursive prefix notation string.
- **CAUTION**: The final evaluation currently uses `eval()` to execute the constructed string. While this operates entirely client-side, the use of `eval()` is a known security vulnerability (XSS/Code Injection) that should be refactored into a safer Abstract Syntax Tree (AST) evaluator in production.

### Data Custodians

**Data Custodian Page (`data_custodian.html`)**
This public-facing page dynamically displays all the assets managed by a specific Data Custodian (team). It fetches the team's profile, active datasets, active projects, publications, and tools to showcase their portfolio to researchers.

**Data Custodian Actions**
Users who are members of a Data Custodian team have access to specific actions and views:
- **Managing Assets**: When navigating to the upload page (`upload.html`), members can view and edit both their published (active) datasets and their unpublished drafts. The dropdown is automatically filtered to only show datasets belonging to their active team.
- **Team Management**: Team administrators can view and manage their team's assets, invite new members, and review data access enquiries submitted by the public.

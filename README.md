# CRUK Datahub Landing Page

Welcome to the **CRUK Datahub Landing Page** frontend application. This repository contains the React-based user interface for browsing, filtering, and managing cancer research datasets, tools, and project metadata.

## 🌟 Key Features

- **Advanced Dataset Filtering Engine:** Features a custom, PubMed-style Boolean logic search (AND/OR, brackets) that allows researchers to build highly specific dataset queries.
- **Hierarchical Terminology Browser:** Integrated support for exploring and filtering by major cancer classification systems, including:
  - ICD-O (Topography & Histology)
  - SNOMED-CT
  - TCGA
  - CRUK-specific terms
- **Dataset & Tool Catalogue:** A dynamic, sortable interface for viewing research meta datasets and software tools, complete with synopses, accessibility restrictions, and structural metadata summaries.
- **AI-Assisted Filtering:** Seamless integration with backend AI microservices to allow natural language queries to pre-filter complex dataset lists.

## 🏗 Architecture Overview

The application is built as a modern Multi-Page Application (MPA) prioritizing fast client-side interactions and modular design. Rather than relying on a single entry point, the frontend uses Vite's multi-page capabilities to serve distinct HTML files for different sections of the platform, each mounting their respective React component trees.

### Frontend Tech Stack
- **Framework:** React.js
- **Build Tool:** Vite (configured for multiple HTML entry points and optimized production bundles)
- **Styling:** Tailwind CSS combined with custom CSS variables (e.g., CRUK brand colors) for a responsive, accessible, and visually distinct interface.
- **Routing:** Handled via distinct HTML files (e.g., `/datasets.html`, `/upload.html`) rather than a purely client-side React router.

### Core Subsystems

1. **Client-Side Query Evaluator (`src/utils/filterLogic.js`)**
   - The application does not rely purely on backend SQL for search. Instead, it converts visual filter selections into Boolean prefix expressions, dynamically generating and evaluating JavaScript `Set` operations in the browser for instant, offline-capable filtering across thousands of records.

2. **Terminology Data Layer (`src/utils/longer_filter_data.js`)**
   - Employs a local hierarchical JSON structure for the taxonomy tree. This is processed on initialization into a flattened, `O(1)` lookup map for high-performance rendering of the nested filter UI.

3. **Backend Connectivity**
   - Designed to run alongside a Python-based middleware (`middle/`) and AI microservice architecture (`ai/`).
   - Fetches live metadata and handles data access requests via standard REST APIs configured through `import.meta.env.VITE_BACKEND_URL`.

---

## 📄 Application Pages

The frontend is divided into several dedicated pages, each focusing on a specific workflow within the Datahub ecosystem:

### Catalogues & Browsing
- **`index.html`**: The main entry point and general landing page for the hub.
- **`datasets.html`**: The primary data catalogue featuring the advanced terminology search, Boolean filtering, and dataset listings.
- **`tools.html`**: A dedicated catalogue for browsing registered software tools and analytical pipelines.
- **`projects.html`**: A directory for viewing ongoing or completed research projects utilizing the datahub.
- **`publications.html`**: A listing of academic publications linked to the data, tools, or projects within the hub.

### Metadata Viewing
- **`meta.html`**: Detailed view page for an individual dataset's structural and descriptive metadata.
- **`project_meta.html` / `tool.html`**: Dedicated detail pages for viewing in-depth information about specific projects and tools.

### Data Upload & Management
- **`upload.html`**: The main interface for data custodians to submit new datasets into the hub.
- **`upload_tool.html` / `upload_project.html` / `upload_publications.html`**: Specialized forms for registering tools, projects, and publications, ensuring metadata conforms to the hub's schemas.
- **`manage_hub.html` / `dashboard.html`**: Administrative interfaces for managing submissions, users, and overall hub activity.

### User Workflows
- **`sign_in.html`**: Authentication portal for researchers and data custodians.
- **`team_request.html`**: Interface for users to request access to specific datasets or to form research teams.
- **`data_custodian.html` / `data_custodians.html`**: Pages detailing the data custodians and their specific access requirements or contact procedures.

---

*Note: This README is a high-level overview. If you need deeper technical details on specific modules (e.g., the set-evaluation engine, the AI integration, or the deployment pipeline), please refer to the specific implementation plans or request targeted documentation.*

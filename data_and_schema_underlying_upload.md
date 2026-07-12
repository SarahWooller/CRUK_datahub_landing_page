1. Core Data & Schema Definitions
These files dictate the structural rules, taxonomies, and validation requirements for the metadata payload.

Base Schemas: hdrukSchema (HDRUK4.0.0.json) and crukSchema (CRUK1.0.0.json).

Overlay Schema: semanticSchema.json (Used for UI overrides and specific Datahub rules).

Taxonomies: filterData (from filter-setup.js) manages the hierarchical cancer and data type filters.

Visual Mapping: prefixIconMapping assigns specific UI icons based on taxonomy IDs.

2. Layout & State Management
This defines the physical real estate of the page.

react-resizable-panels: (Panel, Group, Separator) Drives the flexible left/center/right column layout.

AssistantPane.jsx: The newly created multi-functional right sidebar handling Guidance, the AI widget placeholder, and the Live Preview routing.

3. Modular Input Components (The Central Form)
These handle the specialized data entry requirements beyond standard text fields.

DataTagger.jsx / FilterChipArea: Manages the complex taxonomy tagging for Topography, Histology, and Data Types.

StructuralMetadataGrid.jsx: Renders the data grid for table/column definitions.

CsvUploader.jsx: Allows bulk ingestion of structural metadata via CSV, feeding into the grid.

JsonUpload.jsx: Handles the manual injection of pre-existing JSON metadata payloads.

MarkdownRenderer.jsx: Processes and displays markdown input for rich-text fields like abstracts and documentation.

4. Application Utilities
These pure functions process data before it hits the UI or before it is exported.

flattenSchemaToGrid.js: Converts nested table/column JSON arrays into a flat structure for the StructuralMetadataGrid.

getExtra.js: Likely handles API lookups or semantic expansion for extra SNOMED/ICD-O terms prior to download.

5. Global UI & Feedback
These components wrap the page and handle user assistance.

UploadTopBar.jsx: Manages global page actions (like dataset deletion) and top-level navigation.

FeedbackModal.jsx & upload_questions.json: Drives the user feedback collection mechanism.
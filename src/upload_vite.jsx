import React from 'react';
import ReactDOM from 'react-dom/client';
import SchemaPage from './components/SchemaPage.jsx';
import { Header } from './components/Header.jsx';
import semanticSchema from './utils/semanticSchema.json';
import newProjectSchema from './utils/newProjectSchema.json';
import { deepMerge } from './utils/mergeUtils'; // cite: 14

const SCENARIOS = {
  standard: {
    sections: [
        "welcome", "version", "project", "summary", "documentation", "datasetFilters",
        "structuralMetadata", "erd", "coverage", "provenance", "accessibility"
    ],
    overlay: semanticSchema, // Standard view uses the base semantic rules
    welcomeType: 'standard'
  },
  newProject: {
    sections: ["welcome", "project", "documentation", "accessibility"],
    // Inherit from semanticSchema, then apply newProject overrides
    overlay: deepMerge(semanticSchema, newProjectSchema),
    welcomeType: 'new'
  }
};

function renderReactComponent(targetId, Component) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const root = ReactDOM.createRoot(targetElement);
    root.render(<React.StrictMode>{Component}</React.StrictMode>);
  }
}

// Detect mode from URL (e.g., upload.html?mode=newProject)
const params = new URLSearchParams(window.location.search);
const mode = params.get('mode') || 'standard';
const config = SCENARIOS[mode] || SCENARIOS.standard;

renderReactComponent('header', <Header/>);
renderReactComponent('upload', (
  <SchemaPage
    visibleSections={config.sections}
    semanticOverlay={config.overlay}
    welcomeType={config.welcomeType}
  />
));
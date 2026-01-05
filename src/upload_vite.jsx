import React from 'react';
import ReactDOM from 'react-dom/client';
import SchemaPage from './components/SchemaPage2.jsx';

// 1. Find the root element
const container = document.getElementById('upload');

// 2. Create the React root instance
const root = ReactDOM.createRoot(container);

// 3. Render the SchemaPage component
root.render(
  // React.StrictMode helps find potential problems in the application
  <React.StrictMode>
    <SchemaPage />
  </React.StrictMode>
);
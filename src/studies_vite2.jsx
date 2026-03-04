import React from 'react';
import ReactDOM from 'react-dom/client';
import { Introduction } from './components/Introduction2.jsx';
import { FilterApp } from './components/FilterApp2.jsx';
import { Header } from './components/Header.jsx';
// Import removed: import { StudiesSection } from './components/AltStudiesSection.jsx';
import { FeedbackWidget } from './components/FeedbackWidget.jsx';
import { InstructionsWidget } from './components/InstructionsWidget.jsx';

function renderReactComponent(targetId, Component) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const root = ReactDOM.createRoot(targetElement);
    root.render(
      <React.StrictMode>
        {Component}
      </React.StrictMode>
    );
  } else {
    console.error(`Target element '${targetId}' not found in the DOM.`);
  }
}

renderReactComponent('header', <Header/>);
renderReactComponent('introduction', <Introduction/>);
renderReactComponent('filter_navbar', <FilterApp/>); // This will now contain both sections
// Render removed: renderReactComponent('studies', <StudiesSection/>);
renderReactComponent('feedback_widget', <FeedbackWidget/>);
renderReactComponent(
  'instructions_widget',
  <InstructionsWidget fileUrl="/studies_help.md" />
);
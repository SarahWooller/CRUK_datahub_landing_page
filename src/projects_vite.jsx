import React from 'react';
import ReactDOM from 'react-dom/client';
import { Introduction } from './components/ProjectIntroduction.jsx';
import { ProjectsSection } from './components/ProjectsSection.jsx';
import { Header } from './components/Header.jsx';
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
renderReactComponent('projectsSection', <ProjectsSection/>);
renderReactComponent('feedback_widget', <FeedbackWidget/>);
renderReactComponent(
  'instructions_widget',
  <InstructionsWidget fileUrl="/studies_help.md" />
);
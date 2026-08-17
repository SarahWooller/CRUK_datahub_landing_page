import React from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from './components/Header.jsx';
import { ToolDashboard } from './components/ToolDashboard.jsx';

function renderReactComponent(targetId, Component) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const root = ReactDOM.createRoot(targetElement);
    root.render(
      <React.StrictMode>
        {Component}
      </React.StrictMode>
    );
  }
}

renderReactComponent('header', <Header/>);
renderReactComponent('root', <ToolDashboard/>);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { DataCustodian } from './components/DataCustodian.jsx';
import { Header } from './components/Header.jsx';

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
renderReactComponent('dataCustodianApp', <DataCustodian/>);

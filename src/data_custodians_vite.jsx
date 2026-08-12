import React from 'react';
import ReactDOM from 'react-dom/client';
import { DataCustodians } from './components/DataCustodians.jsx';
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
renderReactComponent('dataCustodiansApp', <DataCustodians/>);

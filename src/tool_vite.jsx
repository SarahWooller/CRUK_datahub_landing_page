import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToolPage } from './components/ToolPage.jsx';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <ToolPage />
        </React.StrictMode>
    );
}

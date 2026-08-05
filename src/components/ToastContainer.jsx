import React from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalToast } from './GlobalToast.jsx';

let isToastInjected = false;

export const injectGlobalToast = () => {
    if (isToastInjected) return;
    if (typeof document === 'undefined') return;

    let toastContainer = document.getElementById('global-toast-root');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'global-toast-root';
        document.body.appendChild(toastContainer);
    }
    
    const root = createRoot(toastContainer);
    root.render(<GlobalToast />);
    isToastInjected = true;
};

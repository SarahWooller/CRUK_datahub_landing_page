import React, { useState, useEffect } from 'react';

export const GlobalToast = () => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const handleShowToast = (event) => {
            setToast(event.detail);
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                setToast(null);
            }, 5000);
        };

        window.addEventListener('show-global-toast', handleShowToast);
        return () => window.removeEventListener('show-global-toast', handleShowToast);
    }, []);

    if (!toast) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-md transition-all duration-300 ease-in-out">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-bold">Something has gone wrong and we are working on it.</p>
                    {toast.correlation_id && (
                        <p className="text-xs mt-1">Reference: {toast.correlation_id}</p>
                    )}
                </div>
                <div className="ml-auto pl-3">
                    <button onClick={() => setToast(null)} className="text-red-500 hover:text-red-700 focus:outline-none">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export const triggerGlobalToast = (correlation_id) => {
    window.dispatchEvent(new CustomEvent('show-global-toast', { 
        detail: { correlation_id } 
    }));
};

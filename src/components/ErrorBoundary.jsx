import React from 'react';

const MIDDLELAYER_URL = import.meta.env.VITE_MIDDLELAYER_URL || "http://localhost:8002";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, correlationId: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        const correlationId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        this.setState({ correlationId });
        
        // Log to middlelayer
        fetch(`${MIDDLELAYER_URL}/logs/error`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_name: 'frontend',
                correlation_id: correlationId,
                message: error.toString(),
                stack_trace: errorInfo.componentStack
            })
        }).catch(err => console.error("Failed to log frontend error", err));
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                        <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h1>
                        <p className="text-gray-600 mb-6">
                            We've encountered an unexpected error and our team has been notified. We are working on it!
                        </p>
                        {this.state.correlationId && (
                            <div className="bg-gray-100 p-3 rounded text-sm text-gray-500 text-left mb-6 font-mono">
                                Reference: {this.state.correlationId}
                            </div>
                        )}
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-[var(--cruk-blue)] text-white py-2 px-4 rounded hover:bg-blue-800 transition-colors font-semibold"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

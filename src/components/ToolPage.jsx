import React, { useState, useEffect } from 'react';
import { Header } from './Header.jsx';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const ToolPage = () => {
    const [tool, setTool] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const toolId = urlParams.get('id');

        if (!toolId) {
            setError("No tool ID specified.");
            setIsLoading(false);
            return;
        }

        fetch(`${API_BASE_URL}/tools/${toolId}`)
            .then(res => {
                if (!res.ok) throw new Error("Tool not found");
                return res.json();
            })
            .then(data => {
                setTool(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-600">Error: {error}</div>;
    if (!tool) return null;

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Header />
            <div className="flex-1 overflow-auto">
                {/* Banner */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 px-8 shadow-inner">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-sm font-semibold tracking-wider text-blue-200 mb-2 uppercase flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                            Analysis Script, Tool or Software
                        </div>
                        <h1 className="text-4xl font-bold mb-4">{tool.name}</h1>
                        {tool.url && (
                            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-200 hover:text-white hover:underline transition-colors">
                                View Source / Website
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col md:flex-row gap-8">
                    {/* Left Column (Metadata) */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Metadata</h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">License</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{tool.license || 'Not specified'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Programming Language</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {tool.tech_stack ? (Array.isArray(tool.tech_stack) ? tool.tech_stack.join(', ') : tool.tech_stack) : 'Not specified'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Authors</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {tool.associated_authors && tool.associated_authors.length > 0 
                                            ? tool.associated_authors.join(', ') 
                                            : 'Not specified'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Right Column (Descriptions) */}
                    <div className="w-full md:w-2/3 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                {tool.description || 'No description provided.'}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Results / Insights</h2>
                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                {tool.results_insights || 'No results/insights provided.'}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

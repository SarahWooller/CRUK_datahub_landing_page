import React, { useState, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer.jsx';
import PreviewAccessCard from './PreviewAccessCard.jsx';
import PreviewTags from './PreviewTags.jsx';
import PreviewMainContent from './PreviewMainContent.jsx';
import AiUploadWidget from './AiUploadWidget.jsx';

const AssistantPane = ({ activeGuidance, formData, activeSection, onFormChange, children }) => {
    const [activeTab, setActiveTab] = useState('guidance'); // 'guidance', 'ai', 'preview'
    const [viewMode, setViewMode] = useState('visual'); // 'visual', 'json'

    useEffect(() => {
        if (activeTab === 'preview' && viewMode === 'visual') {
            let targetId = 'preview-summary';

            if (activeSection === 'accessibility' || activeSection === 'usage') {
                targetId = 'preview-accessibility';
            } else if (activeSection === 'datasetFilters') {
                targetId = 'preview-datasetFilters';
            }

            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [activeSection, activeTab, viewMode]);

    return (
        <div className="w-full border-l border-gray-200 bg-gray-50 h-full flex flex-col flex-shrink-0">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-white shadow-sm">
                <button
                    className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
                        activeTab === 'guidance' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('guidance')}
                >
                    Guidance
                </button>
                <button
                    className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
                        activeTab === 'ai' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('ai')}
                >
                    AI Import
                </button>
                <button
                    className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
                        activeTab === 'preview' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('preview')}
                >
                    Live Preview
                </button>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-6">

                {/* 1. GUIDANCE TAB */}
                <div className={activeTab === 'guidance' ? 'block' : 'hidden'}>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex-1 h-full overflow-y-auto">
                        {activeGuidance ? (
                            <div className="flex flex-col h-full">
                                {activeGuidance.title && (
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                        {activeGuidance.title}
                                    </h3>
                                )}
                                <MarkdownRenderer content={activeGuidance.guidance || activeGuidance} />
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm italic">Select a field on the left to view guidance.</p>
                        )}
                        {children}
                    </div>
                </div>

                {/* 2. AI IMPORT TAB */}
                <div className={activeTab === 'ai' ? 'flex flex-col h-full' : 'hidden'}>
                    <AiUploadWidget formData={formData} onFormChange={onFormChange} />
                </div>

                {/* 3. LIVE PREVIEW TAB */}
                <div className={activeTab === 'preview' ? 'flex flex-col h-full' : 'hidden'}>
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100 px-2">
                            <h3 className="text-sm font-bold text-gray-800">Live Preview</h3>
                            <button
                                onClick={() => setViewMode(prev => prev === 'visual' ? 'json' : 'visual')}
                                className="text-xs font-mono text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded"
                            >
                                {viewMode === 'visual' ? '{ } JSON' : '👁 Visual'}
                            </button>
                        </div>

                        {/* Added id="preview-container" for scoping if needed */}
                        <div id="preview-container" className="flex-1 overflow-y-auto bg-gray-50 rounded border border-gray-200 p-4">
                            {viewMode === 'json' ? (
                                <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                                    {JSON.stringify(formData, null, 2)}
                                </pre>
                            ) : (
                                // --- Unified Vertical Layout ---
                                <div className="flex flex-col gap-8 pb-6">

                                    {/* Left Panel Indicator */}
                                    <div id="preview-accessibility" className="relative">
                                        <div className="flex items-center gap-2 mb-2 text-gray-400 border-b border-gray-200 pb-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="9" y1="3" x2="9" y2="21"></line>
                                            </svg>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Left Navigation Panel</span>
                                        </div>
                                        <PreviewAccessCard data={formData} />
                                    </div>

                                    {/* Central Panel Indicator */}
                                    <div id="preview-summary" className="relative">
                                        <div className="flex items-center gap-2 mb-2 text-gray-400 border-b border-gray-200 pb-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="7" y1="3" x2="7" y2="21"></line>
                                                <line x1="17" y1="3" x2="17" y2="21"></line>
                                            </svg>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Central Main Content</span>
                                        </div>
                                        <PreviewMainContent data={formData} />
                                    </div>

                                    {/* Right Panel Indicator */}
                                    <div id="preview-datasetFilters" className="relative">
                                        <div className="flex items-center gap-2 mb-2 text-gray-400 border-b border-gray-200 pb-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="15" y1="3" x2="15" y2="21"></line>
                                            </svg>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Right Filters Panel</span>
                                        </div>
                                        <PreviewTags data={formData} />
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AssistantPane;
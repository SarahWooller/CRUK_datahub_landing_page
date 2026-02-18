import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export const InstructionsWidget = ({ fileUrl }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch the markdown file when the component mounts or url changes
    useEffect(() => {
        if (fileUrl) {
            setLoading(true);
            fetch(fileUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load instructions");
                    return res.text();
                })
                .then(text => setContent(text))
                .catch(err => setContent(`# Error\nCould not load instructions from ${fileUrl}`))
                .finally(() => setLoading(false));
        }
    }, [fileUrl]);

    if (!fileUrl) return null;

    return (
        <>
            {/* --- BUTTON --- */}
            {/* z-index set to 30000 to beat the AltStudies modal (20000) */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-36 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 z-[30000] font-bold transition-transform transform hover:scale-105"
            >
                Instructions
            </button>

            {/* --- MODAL OVERLAY --- */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[30001] flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                            <h2 className="text-xl font-bold text-gray-800">Instructions</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content (Scrollable) */}
                        <div className="p-6 overflow-y-auto text-gray-700 leading-relaxed">
                            {loading ? (
                                <div className="flex items-center justify-center h-40 text-gray-500">
                                    Loading instructions...
                                </div>
                            ) : (
                                <ReactMarkdown
                                    components={{
                                        // Map standard markdown elements to Tailwind styles
                                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-2" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-4 text-base" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                        a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-orange-500 pl-4 italic bg-orange-50 p-2 my-4 rounded-r" {...props} />,
                                        code: ({node, inline, ...props}) =>
                                            inline
                                                ? <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-600" {...props} />
                                                : <code className="block bg-gray-800 text-white p-3 rounded-lg text-sm font-mono my-4 overflow-x-auto" {...props} />
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
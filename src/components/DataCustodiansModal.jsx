import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export const DataCustodiansModal = ({ isOpen, onClose }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetch('/data_custodians.md')
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.text();
                })
                .then(text => setContent(text))
                .catch(err => console.error('Failed to load markdown', err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-[800px] max-w-[90vw] max-h-[90vh] overflow-y-auto relative animate-fade-in">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
                >
                    &times;
                </button>
                
                <div className="prose prose-blue max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
                
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Close</button>
                </div>
            </div>
        </div>
    );
};

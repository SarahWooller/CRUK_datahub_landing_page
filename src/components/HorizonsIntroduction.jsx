import React from 'react';
import ReactMarkdown from 'react-markdown';
import introText from '../IntroductionCRH.md?raw';

export const HorizonsIntroduction = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--cruk-blue)] mb-6 tracking-tight">
                Cancer Research Horizons Portfolio
            </h1>

            <div className="space-y-6 text-gray-700 text-lg sm:text-xl leading-relaxed">
                <ReactMarkdown
                    components={{
                        a: ({node, ...props}) => <a {...props} className="text-[var(--cruk-pink)] underline hover:text-red-700" target="_blank" rel="noopener noreferrer" />
                    }}
                >
                    {introText}
                </ReactMarkdown>
            </div>
        </div>
    );
};

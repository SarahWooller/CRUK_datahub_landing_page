import React from 'react';

const FeedbackFallback = ({ data, onCopy, onDismiss }) => {
    if (!data) return null;
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-60 p-4 pointer-events-auto">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full border border-gray-300 relative">
                <button
                    onClick={onDismiss}
                    className="absolute top-4 right-6 text-4xl text-gray-400 hover:text-red-600 transition-colors leading-none"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold text-red-700 mb-4 pr-8">Email Client Not Found</h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    Unable to open your email app. If you would like to copy the following text to clipboard and manually email to **skw24@sussex.ac.uk** please click here.
                </p>
                <textarea readOnly className="w-full h-48 p-4 border border-gray-200 rounded-lg bg-gray-50 text-base mb-6 font-mono" value={data} />
                <button
                    onClick={() => onCopy(data)}
                    className="w-full py-5 bg-indigo-700 text-white font-bold rounded-lg text-lg hover:bg-indigo-800 transition-all shadow-lg"
                >
                    Copy to Clipboard & Close
                </button>
            </div>
        </div>
    );
};

export default FeedbackFallback;
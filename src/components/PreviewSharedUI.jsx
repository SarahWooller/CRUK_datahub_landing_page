import React from 'react';

export const StatCard = ({ label, value, colorClass }) => (
  <div className={`p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center ${colorClass}`}>
    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</span>
    <span className="text-lg font-semibold text-gray-800 break-words w-full">{value}</span>
  </div>
);

export const SectionHeading = ({ id, title, children }) => (
  <div className="flex justify-between items-end mt-10 mb-4 pb-2 border-b border-gray-200">
      <h2 id={id} className="text-2xl font-bold text-gray-800">
        {title}
      </h2>
      {children}
  </div>
);

export const AccessItem = ({ label, value, isLink }) => {
    const displayValue = value || "Information not provided";
    return (
        <div className="mb-3">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</span>
            {isLink && value ? (
                <a href={displayValue} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline break-words block">
                    {displayValue}
                </a>
            ) : (
                <p className="text-sm text-gray-700 leading-snug break-words">{displayValue}</p>
            )}
        </div>
    );
};
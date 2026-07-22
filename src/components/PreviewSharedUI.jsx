import React from 'react';

export const StatCard = ({ label, value, colorClass, onClick }) => (
  <div className={`p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center ${colorClass}`}>
    <span 
      className={`text-xs font-bold uppercase tracking-wider mb-1 ${onClick ? 'text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors' : 'text-gray-500'}`}
      onClick={onClick}
    >
      {label}
    </span>
    <span className="text-lg font-semibold text-gray-800 break-words w-full">{value}</span>
  </div>
);

export const SectionHeading = ({ id, title, children, onClick }) => (
  <div className="flex justify-between items-end mt-10 mb-4 pb-2 border-b border-gray-200">
      <h2 
        id={id} 
        className={`text-2xl font-bold ${onClick ? 'text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors' : 'text-gray-800'}`}
        onClick={onClick}
      >
        {title}
      </h2>
      {children}
  </div>
);

export const AccessItem = ({ label, value, isLink, isPreview = false, onClick }) => {
    const isEmpty = value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    
    if (!isPreview && isEmpty) {
        return null;
    }

    const displayValue = !isEmpty ? value : "Information not provided";
    
    return (
        <div className="mb-3">
            <span 
                className={`block text-xs font-bold uppercase tracking-wide mb-1 ${onClick ? 'text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors' : 'text-gray-500'}`}
                onClick={onClick}
            >
                {label}
            </span>
            {isLink && !isEmpty ? (
                <a href={displayValue} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline break-words block">
                    {displayValue}
                </a>
            ) : (
                <p className={`text-sm leading-snug break-words ${isEmpty ? 'text-gray-400 italic' : 'text-gray-700'}`}>{displayValue}</p>
            )}
        </div>
    );
};
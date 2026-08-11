import React from 'react';
import { DatasetDetailsContent } from './MetaDataPage.jsx';

const PreviewMainContent = ({ data, onSectionClick }) => {
    return (
        <div className="w-full h-full p-4 overflow-y-auto">
            <DatasetDetailsContent data={data} isPreview={true} onSectionClick={onSectionClick} />
        </div>
    );
};

export default PreviewMainContent;
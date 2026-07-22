import React, { useState } from 'react';
import { AccessItem } from './PreviewSharedUI';

const PreviewAccessCard = ({ data, onSectionClick }) => {
    const [emailCopied, setEmailCopied] = useState(false);
    const summary = data.summary || {};
    const accessibility = data.accessibility || {};
    const access = accessibility.access || {};
    const usage = accessibility.usage || {};

    const resourceCreators = Array.isArray(usage.resourceCreator)
        ? usage.resourceCreator.join(', ')
        : (usage.resourceCreator?.name || usage.resourceCreator || "Information not provided");

    const handleCopyEmail = () => {
        if (!summary.contactPoint) return;
        const emailToCopy = Array.isArray(summary.contactPoint) ? summary.contactPoint[0] : summary.contactPoint;
        navigator.clipboard.writeText(emailToCopy).then(() => {
            setEmailCopied(true);
            setTimeout(() => setEmailCopied(false), 2000);
        }).catch(err => console.error("Failed to copy text: ", err));
    };

    return (
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 w-full">
            <div className="mb-4 border-b border-blue-200 pb-3 relative flex flex-col gap-2">
                <h4 
                    className={`font-bold ${onSectionClick ? 'text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors' : 'text-blue-900'}`}
                    onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined}
                >
                    Data Access
                </h4>

                {/* Email Copy Container */}
                {summary.contactPoint && (
                    <div className="flex items-center text-sm text-gray-700 bg-white border border-blue-200 px-3 py-1.5 rounded w-fit">
                        <span className="truncate mr-2 font-medium">{Array.isArray(summary.contactPoint) ? summary.contactPoint[0] : summary.contactPoint}</span>
                        <button
                            onClick={handleCopyEmail}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-100 flex-shrink-0"
                            title="Copy Contact Email"
                        >
                            {emailCopied ? (
                                <span className="text-xs text-green-600 font-bold">Copied</span>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Pipeline Status */}
            {data.documentation?.inPipeline && (
                <div className="mb-4 flex items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mr-2">Pipeline Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${data.documentation.inPipeline === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {data.documentation.inPipeline}
                    </span>
                </div>
            )}

            <AccessItem
                label="Data Custodian"
                value={summary.dataCustodian?.name || summary.publisher?.name || "Information not provided"}
                isPreview={true}
                onClick={onSectionClick ? () => onSectionClick('summary') : undefined}
            />
            <AccessItem
                label="Access Rights"
                value={access.accessRights}
                isPreview={true}
                onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined}
            />
            <AccessItem label="Data Controller" value={data.accessibility?.access?.dataController} isPreview={true} onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined} />
            <AccessItem label="Data Processor" value={data.accessibility?.access?.dataProcessor} isPreview={true} onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined} />
            <AccessItem label="Access Service" value={data.accessibility?.access?.accessService} isPreview={true} onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined} />
            <AccessItem label="Access Service Category" value={data.accessibility?.access?.accessServiceCategory} isPreview={true} onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined} />
            <AccessItem label="Access Request Cost" value={data.accessibility?.access?.accessRequestCost} isPreview={true} onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined} />
            <AccessItem label="Jurisdiction" value={Array.isArray(data.accessibility?.access?.jurisdiction) ? data.accessibility.access.jurisdiction.join(', ') : data.accessibility?.access?.jurisdiction} isPreview={true} onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined} />
            <AccessItem
                label="Resource Creator"
                value={resourceCreators}
                isPreview={true}
                onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined}
            />
            <AccessItem
                label="Delivery Lead Time"
                value={access.deliveryLeadTime}
                isPreview={true}
                onClick={onSectionClick ? () => onSectionClick('accessibility') : undefined}
            />
        </div>
    );
};

export default PreviewAccessCard;
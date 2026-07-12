import React from 'react';
import { AccessItem } from './PreviewSharedUI';

const PreviewAccessCard = ({ data }) => {
    const summary = data.summary || {};
    const accessibility = data.accessibility || {};
    const access = accessibility.access || {};
    const usage = accessibility.usage || {};

    const resourceCreators = Array.isArray(usage.resourceCreator)
        ? usage.resourceCreator.join(', ')
        : (usage.resourceCreator?.name || usage.resourceCreator || "Information not provided");

    return (
        <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 w-full">
            <div className="flex justify-between items-center mb-4 border-b border-blue-200 pb-2 relative">
                <h4 className="font-bold text-blue-900">Data Access</h4>
            </div>

            <AccessItem
                label="Data Custodian"
                value={summary.dataCustodian?.name || summary.publisher?.name || "Information not provided"}
            />
            <AccessItem
                label="Access Rights"
                value={access.accessRights}
            />
            <AccessItem
                label="Resource Creator"
                value={resourceCreators}
            />
            <AccessItem
                label="Delivery Lead Time"
                value={access.deliveryLeadTime}
            />
        </div>
    );
};

export default PreviewAccessCard;
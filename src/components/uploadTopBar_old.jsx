import React, { useMemo } from 'react';
// Assuming the example file exists at this path
import exampleData from '../utils/dummy_data/example_for_download.json';

// --- Icons ---
const DownloadIcon = () => (
    <svg className="w-4 h-4 mr-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
);

const ActiveIcon = () => (
    <svg className="w-4 h-4 mr-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const SaveIcon = () => (
    <svg className="w-4 h-4 mr-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
);

const ChartIcon = () => (
    <svg className="w-4 h-4 mr-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
);

// --- Component ---
const UploadTopBar = ({ formData, schema, prefixIconMapping }) => {

    // --- 1. Helper Logic ---

    const resolveRef = (ref) => {
        if (!ref || typeof ref !== 'string' || !ref.startsWith('#/$defs/')) return null;
        const defKey = ref.split('/').pop();
        return schema.$defs ? schema.$defs[defKey] : null;
    };

    const getDefinition = (prop) => {
        let definition = prop;
        let ref = prop.$ref || prop.allOf?.find(i => i.$ref)?.$ref || prop.anyOf?.find(i => i.$ref)?.$ref;
        if (ref) definition = resolveRef(ref);
        return definition || prop;
    };

    const isEmpty = (value) => {
        if (value === undefined || value === null) return true;
        if (typeof value === 'string' && value.trim() === '') return true;
        if (Array.isArray(value) && value.length === 0) return true;
        if (typeof value === 'object' && Object.keys(value).length === 0) return true;
        return false;
    };

    const associateIcons = (data, mapping) => {
        if (!data.datasetFilters || !Array.isArray(data.datasetFilters) || !mapping) {
            return { ...data, icons: [] };
        }
        const dataIds = data.datasetFilters
            .map(item => (typeof item === 'object' ? item.id : item))
            .filter(id => id && id.startsWith("0_2"));

        const uniqueIcons = new Set();
        dataIds.forEach(id => {
            const trunc5 = id.substring(0, 5);
            const trunc7 = id.substring(0, 7);
            if (mapping[trunc5]) uniqueIcons.add(mapping[trunc5]);
            if (mapping[trunc7]) uniqueIcons.add(mapping[trunc7]);
        });

        return { ...data, icons: Array.from(uniqueIcons) };
    };

    const completionStats = useMemo(() => {
        let reqTotal = 0;
        let reqFilled = 0;
        let optTotal = 0;
        let optFilled = 0;

        if (!schema || !schema.properties) return { req: 0, opt: 0 };

        Object.keys(schema.properties).forEach(sectionKey => {
            const sectionSchema = schema.properties[sectionKey];
            const definition = getDefinition(sectionSchema);
            const sectionData = formData[sectionKey] || {};

            if (definition && definition.properties) {
                const requiredProps = definition.required || [];
                const allProps = Object.keys(definition.properties);

                allProps.forEach(propKey => {
                    const isReq = requiredProps.includes(propKey);
                    const value = sectionData[propKey];
                    const filled = !isEmpty(value);

                    if (isReq) {
                        reqTotal++;
                        if (filled) reqFilled++;
                    } else {
                        optTotal++;
                        if (filled) optFilled++;
                    }
                });
            }
        });

        const filters = formData['datasetFilters'];
        reqTotal++;
        if (filters && filters.length > 0) reqFilled++;

        const reqPercent = reqTotal === 0 ? 100 : Math.round((reqFilled / reqTotal) * 100);
        const optPercent = optTotal === 0 ? 100 : Math.round((optFilled / optTotal) * 100);

        return { req: reqPercent, opt: optPercent };
    }, [formData, schema]);


    // --- 2. Action Handlers ---

    // RESTORED: Download the template example
    const handleDownloadExample = () => {
        try {
            const blob = new Blob([JSON.stringify(exampleData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "example_metadata.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Error downloading example:", e);
        }
    };

    // MOVED: Download the user's current work
    const handleDownloadProgress = () => {
        try {
            let processedData = associateIcons(formData, prefixIconMapping);

            if (processedData.summary) {
                const summarySchema = schema.properties?.summary;
                let summaryDef = summarySchema;
                if (summarySchema?.$ref) summaryDef = resolveRef(summarySchema.$ref);

                if (summaryDef?.properties) {
                    Object.keys(summaryDef.properties).forEach(key => {
                        if (isEmpty(processedData.summary[key]) && summaryDef.properties[key].default !== undefined) {
                            processedData.summary[key] = summaryDef.properties[key].default;
                        }
                    });
                }
            }

            if (processedData.version) {
                const revisions = processedData.revisions || [];
                if (!revisions.some(rev => rev.version === processedData.version)) {
                    processedData.revisions = [...revisions, { version: processedData.version, url: null }];
                }
            }
            processedData.modified = new Date().toISOString();

            const fileData = JSON.stringify(processedData, null, 2);
            const blob = new Blob([fileData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            const fileName = processedData.summary?.title
                ? `${processedData.summary.title.replace(/\s+/g, '_')}_metadata.json`
                : "dataset_metadata.json";

            link.download = fileName;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Error exporting progress:", e);
        }
    };
    const handleDownloadGuide = () => {
        // This assumes your file is named 'guidance.pdf' in the public folder
        const link = document.createElement("a");
        link.href = "/guidance.pdf";
        link.download = "CRUK_Datahub_Guide.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // --- 3. Render ---
    return (
        <div className="w-full h-10 bg-[var(--cruk-darkblue)] text-white flex items-center px-6 shadow-md z-20 relative text-sm font-medium">

            {/* Left: Dual Download Actions */}
            <div className="flex-1 flex justify-start space-x-6">
                <button
                    onClick={handleDownloadExample}
                    className="flex items-center hover:opacity-80 transition-opacity focus:outline-none"
                    title="Download a template metadata file"
                >
                    <DownloadIcon />
                    Download example
                </button>

                <div className="w-px h-4 bg-white opacity-20 self-center"></div>

                <button
                    onClick={handleDownloadProgress}
                    className="flex items-center hover:opacity-80 transition-opacity focus:outline-none"
                    title="Export your current progress as a JSON file"
                >
                    <DownloadIcon />
                    Download progress to date
                </button>
                <div className="w-px h-4 bg-white opacity-20 self-center"></div>
                <button
                    onClick={handleDownloadGuide}
                    className="flex items-center hover:opacity-80 transition-opacity focus:outline-none"
                    title="Download the PDF user guide"
                >
                    <DownloadIcon />
                    Download guide to uploading
                </button>
            </div>

            {/* Centre: Actions */}
            <div className="flex-1 flex justify-center space-x-8">
                <button className="flex items-center hover:opacity-80 transition-opacity cursor-not-allowed opacity-70">
                    <ActiveIcon />
                    Make active
                </button>
                <button className="flex items-center hover:opacity-80 transition-opacity cursor-not-allowed opacity-70">
                    <SaveIcon />
                    Save as draft
                </button>
            </div>

            {/* Right: Stats */}
            <div className="flex-1 flex justify-end items-center">
                <ChartIcon />
                <span>
                    Completion: <span className="font-bold text-green-300">{completionStats.req}%</span> (required) &nbsp;|&nbsp; <span className="font-bold text-blue-300">{completionStats.opt}%</span> (optional)
                </span>
            </div>
        </div>
    );
};

export default UploadTopBar;
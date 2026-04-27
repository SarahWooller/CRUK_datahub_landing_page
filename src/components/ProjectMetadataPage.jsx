import React, { useState, useEffect } from 'react';

export const ProjectMetadataPage = () => {
    const [dataset, setDataset] = useState(null);
    const [project, setProject] = useState(null);
    const [datasetId, setDatasetId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setIsLoading(true);
                const params = new URLSearchParams(window.location.search);
                const fullId = params.get('id');

                if (!fullId || !fullId.includes('_')) {
                    throw new Error("Invalid project ID format. Expected format: xx_yyy");
                }

                // Extract the dataset ID (xx) and the project index (yyy)
                const [dsId, grantIdxStr] = fullId.split('_');
                const grantIdx = parseInt(grantIdxStr, 10);

                setDatasetId(dsId);

                // Dynamically import the corresponding dataset
                const module = await import(`../utils/new_dummies/dataset_${dsId}.json`);
                const data = module.default || module;

                // Check if the projectGrants array exists and has an item at the requested index
                if (!data.projectGrants || !data.projectGrants[grantIdx]) {
                    throw new Error("Project grant not found in this dataset.");
                }

                setDataset(data);
                setProject(data.projectGrants[grantIdx]);
                setError(null);
            } catch (err) {
                console.error("Failed to load project:", err);
                setError("Project not found or could not be loaded.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-xl text-gray-600 font-semibold">Loading project data...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <p className="text-xl text-red-600 font-semibold mb-4">{error}</p>
                {datasetId && (
                    <a href={`meta.html?id=${datasetId}`} className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors">
                        ← Return to Dataset {datasetId}
                    </a>
                )}
            </div>
        );
    }

    const enrichmentAndLinkage = dataset.enrichmentAndLinkage || {};

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-8">
            <div className="max-w-4xl mx-auto">

                {/* Navigation / Header */}
                <div className="mb-8">

                    <h1 className="text-4xl font-extrabold text-blue-900 mb-3">
                        {project.projectGrantName}
                    </h1>
                    <div className="text-sm text-gray-500 font-mono">
                        Project ID: {project.pid}
                    </div>
                </div>

                {/* Project Details Card */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                                Lead Researcher
                            </span>
                            <p className="text-lg font-semibold text-gray-800 m-0">
                                {project.leadResearcher}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 italic">
                                {project.leadResearchInstitute}
                            </p>
                        </div>

                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                                Timeline
                            </span>
                            <p className="text-base text-gray-800 m-0">
                                {project.projectGrantStartDate} to {project.projectGrantEndDate || "Ongoing"}
                            </p>
                        </div>

                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                                Grant Number(s)
                            </span>
                            <p className="text-base font-mono text-gray-700 m-0">
                                {project.grantNumber}
                            </p>
                        </div>

                        <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Project Scope
                            </span>
                            <p className="text-base text-gray-700 m-0 leading-relaxed">
                                {project.projectGrantScope}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Enrichment & Linkage Section (Inherited from Dataset) */}
                {Object.keys(enrichmentAndLinkage).length > 0 && (
                    <div className="mb-10">
                        <div className="flex justify-between items-end mb-4 pb-2 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Enrichment & Linkage
                            </h2>
                        </div>
                        <a
                        href={`meta.html?id=${datasetId}`}
                        className="inline-block mb-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        Linked Dataset
                    </a>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(enrichmentAndLinkage).map(([key, value]) => {
                                if (!value || (Array.isArray(value) && value.length === 0)) return null;

                                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                                const getHref = (str) => {
                                    if (typeof str !== 'string') return null;
                                    if (str.startsWith('http')) return str;
                                    if (str.startsWith('10.')) return `https://doi.org/${str}`;
                                    return null;
                                };

                                return (
                                    <div key={key}>
                                        <h4 className="font-bold text-gray-500 uppercase tracking-wide mb-2 text-sm">{formattedKey}</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 break-words">
                                            {Array.isArray(value) ? value.map((item, idx) => {
                                                if (typeof item === 'object' && item !== null) {
                                                    const displayText = `${item.title || ''} ${item.pid ? `[${item.pid}]` : ''}`.trim() || item.url;
                                                    const href = getHref(item.url);

                                                    return (
                                                        <li key={idx}>
                                                            {href ? (
                                                                <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                                                                    {displayText}
                                                                </a>
                                                            ) : (
                                                                <span>{displayText}</span>
                                                            )}
                                                        </li>
                                                    );
                                                }

                                                const href = getHref(item);
                                                return (
                                                    <li key={idx}>
                                                        {href ? (
                                                            <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors break-all">
                                                                {item}
                                                            </a>
                                                        ) : (
                                                            <span>{item}</span>
                                                        )}
                                                    </li>
                                                );
                                            }) : <li>{value}</li>}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
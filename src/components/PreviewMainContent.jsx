import React, { useState, useMemo } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer.jsx';
import { ICON_MAPPING, ETHNICITY_CATEGORIES, getFirstTwoSentences } from '../utils/metadataUtils';
import { StatCard, SectionHeading } from './PreviewSharedUI';

const PreviewMainContent = ({ data }) => {
    const isNotEmpty = (obj) => {
        if (!obj) return false;
        return Object.values(obj).some(val => val !== null && val !== "" && val !== undefined);
    };

    const [expandedTables, setExpandedTables] = useState({});
    const [expandedOtherData, setExpandedOtherData] = useState({});
    const [currentGrantIndex, setCurrentGrantIndex] = useState(0);

    const summary = data.summary || {};
    const otherDataTypes = (data.otherDataTypes || []).filter(isNotEmpty);
    const demographicFrequency = data.demographicFrequency || {};
    const projectGrants = (data.projectGrants || []).filter(isNotEmpty);
    const observations = (data.observations || []).filter(isNotEmpty);
    const omics = data.omics || null;
    const provenance = data.provenance || {};
    const enrichmentAndLinkage = data.enrichmentAndLinkage || {};

    const descriptionText = data.documentation?.description || data.summary?.description || "";
    const documentationPreview = useMemo(() => getFirstTwoSentences(descriptionText), [descriptionText]);

    const mappedEthnicities = useMemo(() => {
        const ethnicityData = demographicFrequency.ethnicity;
        if (!ethnicityData || !Array.isArray(ethnicityData) || ethnicityData.length === 0) return null;

        const lookupMap = ethnicityData.reduce((acc, curr) => {
            acc[curr.bin] = curr.count;
            return acc;
        }, {});

        const mapped = ETHNICITY_CATEGORIES.map(category => ({
            label: category,
            count: lookupMap[category] || 0
        }));

        const maxCount = Math.max(...mapped.map(e => e.count));
        return { data: mapped, maxCount };
    }, [demographicFrequency.ethnicity]);

    const groupedMetadata = useMemo(() => {
        const tables = data.structuralMetadata?.tables || data.structuralMetadata || [];
        return tables.reduce((acc, item) => {
            const entity = item.name;
            const desc = item.description || "";
            if (!acc[entity]) {
                acc[entity] = { description: desc, columns: [], size: item.size };
            }
            if (item.columns) acc[entity].columns.push(...item.columns);
            return acc;
        }, {});
    }, [data]);

    const activeIcons = useMemo(() => {
        const icons = new Set();
        const targetIconKeys = Object.keys(ICON_MAPPING);
        const filterObjects = data.datasetFilters || [];

        filterObjects.forEach(filter => {
            if (targetIconKeys.includes(filter.label)) icons.add(filter.label);
            else if (targetIconKeys.includes(filter.category)) icons.add(filter.category);
        });
        return Array.from(icons).map(key => ICON_MAPPING[key]);
    }, [data]);

    const population = data.summary?.populationSize;
    const ageRange = data.coverage?.typicalAgeRangeMin && data.coverage?.typicalAgeRangeMax
        ? `${data.coverage.typicalAgeRangeMin} - ${data.coverage.typicalAgeRangeMax}`
        : (data.coverage?.typicalAgeRange || null);
    const leadTime = data.accessibility?.access?.deliveryLeadTime;
    const followUp = data.coverage?.followUp;

    const toggleTable = (entityName) => setExpandedTables(prev => ({ ...prev, [entityName]: !prev[entityName] }));
    const toggleAllTables = (shouldExpand) => {
        const newState = {};
        Object.keys(groupedMetadata).forEach(key => { newState[key] = shouldExpand; });
        setExpandedTables(newState);
    };
    const toggleOtherData = (index) => setExpandedOtherData(prev => ({ ...prev, [index]: !prev[index] }));

    return (
        <div className="w-full h-full p-4 overflow-y-auto">
            {/* Header Area */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-blue-900 mb-2">{summary.title || "Untitled Dataset"}</h1>
                <div className="text-sm text-gray-600">
                    <span className="font-semibold mr-2">Data Custodian:</span>
                    {summary.dataCustodian?.name || "Unknown"}
                </div>
            </div>

            {/* Icons */}
            <div className="flex flex-wrap gap-4 mb-8">
                {activeIcons.length > 0 ? (
                    activeIcons.map((icon, idx) => (
                        <div key={idx} className="w-12 h-12 bg-white rounded shadow-sm flex items-center justify-center border border-gray-100">
                            <img src={icon.src} alt={icon.label} className="w-8 h-8 object-contain" title={icon.label} />
                        </div>
                    ))
                ) : (
                    <div className="text-gray-400 italic text-xs">No specific data type icons found.</div>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {population && <StatCard label="Population" value={population?.toLocaleString()} colorClass="bg-blue-50" />}
                {ageRange && <StatCard label="Age Range" value={ageRange} colorClass="bg-green-50" />}
                {leadTime && <StatCard label="Access" value={leadTime} colorClass="bg-purple-50" />}
                {followUp && <StatCard label="Follow Up" value={followUp} colorClass="bg-yellow-50" />}
            </div>

            {/* Project Grants */}
            {projectGrants.length > 0 && (
                <>
                    <SectionHeading id="project" title="CRUK Project" />
                    <div className="text-sm text-gray-700 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <span className="block text-xs font-bold text-gray-500 uppercase">Project Name</span>
                        <p className="font-semibold text-blue-900 mb-2">{projectGrants[currentGrantIndex].projectGrantName}</p>
                        <span className="block text-xs font-bold text-gray-500 uppercase">Lead Researcher</span>
                        <p>{projectGrants[currentGrantIndex].leadResearcher}</p>
                    </div>
                </>
            )}

            {/* Summary */}
            <SectionHeading id="summary" title="Summary" />
            <div className="text-sm text-gray-700 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p>{summary.abstract}</p>
            </div>

            {/* Documentation */}
            <SectionHeading id="documentation" title="Documentation" />
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-sm">
                <MarkdownRenderer content={descriptionText || documentationPreview} />
            </div>

            {/* Structural Metadata */}
            <SectionHeading id="structural-metadata" title="Structural Metadata">
                 <div className="space-x-2">
                    <button onClick={() => toggleAllTables(true)} className="text-xs text-blue-600 underline">Expand All</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => toggleAllTables(false)} className="text-xs text-blue-600 underline">Collapse All</button>
                 </div>
            </SectionHeading>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              {Object.keys(groupedMetadata).length === 0 ? (
                 <p className="p-4 text-gray-500 text-sm">No structural metadata available.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                    <tbody className="text-sm">
                      {Object.entries(groupedMetadata).map(([entityName, tableData]) => {
                        const isExpanded = expandedTables[entityName];
                        return (
                            <React.Fragment key={entityName}>
                                <tr className="bg-blue-50 border-b border-blue-100 cursor-pointer" onClick={() => toggleTable(entityName)}>
                                    <td className="p-3 font-bold text-blue-900">{entityName}</td>
                                </tr>
                                {isExpanded && tableData.columns.map((col, idx) => (
                                    <tr key={`${entityName}-${col.name}-${idx}`} className="border-b bg-white">
                                        <td className="p-3 pl-6 font-mono text-gray-700">{col.name} ({col.dataType})</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        );
                      })}
                    </tbody>
                </table>
              )}
            </div>

            {/* Demographic Frequency */}
            {mappedEthnicities && (
                <>
                    <SectionHeading id="demographic-frequency" title="Ethnicity Distribution" />
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-8">
                        <div className="space-y-2">
                            {mappedEthnicities.data.map((item, idx) => {
                                const barWidth = mappedEthnicities.maxCount > 0 ? `${(item.count / mappedEthnicities.maxCount) * 100}%` : '0%';
                                const barColor = idx % 2 === 0 ? 'bg-blue-600' : 'bg-pink-400';
                                return (
                                    <div key={idx} className="flex items-center text-xs">
                                        <div className="w-1/2 text-right pr-2 text-gray-700">{item.label}</div>
                                        <div className="w-1/2 flex items-center">
                                            <div className="flex-1 h-3"><div className={`h-full ${barColor} rounded-r`} style={{ width: barWidth }}></div></div>
                                            <div className="ml-2 font-semibold text-gray-600 w-8">{item.count}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PreviewMainContent;
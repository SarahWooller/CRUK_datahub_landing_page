import { filterData } from './filter_data.js';
import React from 'react'; // React is now imported from node_modules
import "../styles/style.css"

const filterDetailsMap = new Map();
const populateMap = (nodes, primaryGroup) => {
    if (!nodes) return;
    const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
    nodesArray.forEach(item => {
        const fullId = item.id;
        filterDetailsMap.set(fullId, { id: item.id, label: item.label, category: item.category, group: primaryGroup, });
        if (item.children && Object.keys(item.children).length > 0) {
            populateMap(item.children, primaryGroup);
        }
    });
};
populateMap(filterData['0_0'].children, filterData['0_0'].primaryGroup);
populateMap(filterData['0_2'].children, filterData['0_2'].primaryGroup);
populateMap(filterData['0_1'].children, filterData['0_1'].primaryGroup);
// --- END DUMMY DATA ---


// --- ALL REACT COMPONENTS FROM knockdown.html START HERE ---
const { useState, useMemo, useCallback } = React;

// Utility component for nested filters with toggle
const NestedFilterList = ({ items, handleFilterChange, selectedFilters, level = 0 }) => {
    if (!items || items.length === 0) return null;
    const itemsArray = Array.isArray(items) ? items : Object.values(items);

    return (
        <div className="nested-list space-y-1">
            {itemsArray.map(item => (
                <NestedFilterItem
                    key={item.id}
                    item={item}
                    handleFilterChange={handleFilterChange}
                    selectedFilters={selectedFilters}
                    level={level}
                />
            ))}
        </div>
    );
};

// Component for a single filter item
const NestedFilterItem = ({ item, handleFilterChange, selectedFilters, level }) => {
    const fullId = item.id;
    const childrenArray = item.children ? Object.values(item.children) : [];
    const hasChildren = childrenArray.length > 0;
    const isChecked = selectedFilters.has(fullId);

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = (e) => {
        e.preventDefault();
        setIsExpanded(prev => !prev);
    };

    const rowIndentStyle = {
        paddingLeft: level > 0 ? `${level * 1.25}rem` : '0',
    };

    const details = filterDetailsMap.get(fullId) || {};
    const primaryGroup = details.group;


    return (
        <div className="flex flex-col">
            <div
                className="flex items-center group hover:var(--cruk-pink) p-1 -m-1 rounded transition duration-100"
                style={rowIndentStyle}
            >
                {hasChildren ? (
                    <button
                        type="button"
                        className={`transition-transform duration-200 w-4 h-4 flex items-center justify-center text-gray-500 hover:var(--cruk-pink)  mr-1 ${isExpanded ? 'rotate-90' : ''}`}
                        onClick={toggleExpansion}
                        aria-expanded={isExpanded}
                    >
                        {/* Chevron Right Icon (inline SVG) */}
                        <svg className="w-3 h-3 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                ) : (
                    <span className="w-4 h-4 mr-1"></span>
                )}

                <input
                    type="checkbox"
                    id={fullId}
                    className="rounded text-[var(--cruk-pink)] border-gray-300 focus:ring-[var(--cruk-pink)] mr-2 w-4 h-4 cursor-pointer"
                    data-filter-group={primaryGroup}
                    checked={isChecked}
                    onChange={() => handleFilterChange(fullId)}
                />
                <label htmlFor={fullId} className="text-gray-700 select-none flex-grow cursor-pointer text-sm">
                    {item.label}
                    <span className="text-xs text-gray-500 ml-1">({item.count})</span>
                </label>
            </div>
            {hasChildren && isExpanded && (
                <NestedFilterList
                    items={childrenArray}
                    handleFilterChange={handleFilterChange}
                    selectedFilters={selectedFilters}
                    level={level + 1}
                />
            )}
        </div>
    );
};


// Component for the dynamic chips display
const FilterChipArea = ({ selectedFilters, handleFilterChange }) => {

    const chips = useMemo(() => {
        const chipArray = Array.from(selectedFilters).map(fullId => {
            const details = filterDetailsMap.get(fullId);
            if (!details) return null;

            const isCancer = details.group === 'cancer-type';
            const chipClass = isCancer
                ? 'bg-[var(--cruk-white)] text-[var(--cruk-pink)] border border-[var(--cruk-pink)]'
                : 'bg-[var(--cruk-white)] text-[var(--cruk-blue)] border border-[var(--cruk-blue)]';

            return {
                fullId,
                label: details.label,
                category: details.category,
                chipClass,
            };
        }).filter(Boolean);
        return chipArray;
    }, [selectedFilters]);

    if (chips.length === 0) {
        return null;
    }

    return (
        <div
            id="selected-filters-area"
            className="bg-white rounded-b-xl shadow-lg border-b border-l border-r border-gray-300 p-3 transition duration-300 ease-in-out"
        >
            <div id="filter-chip-list" className="flex items-start flex-wrap gap-2 text-sm">
                {chips.map(chip => (
                    <div
                        key={chip.fullId}
                        className={`filter-chip inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${chip.chipClass}`}
                    >

                        <span className="mr-1 opacity-75">{chip.category}:</span>
                        <span className="font-bold">{chip.label}</span>
                        <button
                            type="button"
                            className="ml-2 h-4 w-4 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-50 transition duration-150"
                            onClick={() => handleFilterChange(chip.fullId)}
                            aria-label={`Remove filter ${chip.label}`}
                        >
                            {/* Close Icon (inline SVG) */}
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                ))}
            </div>

            <p id="logic-summary" className="text-xs text-gray-500 mt-2 px-1">
                Logic: (Cancer Filters are OR-ed) AND (Data Type Filters are AND-ed) AND (Accessibility Filters are AND-ed)
            </p>
        </div>
    );
};


// Main Application Component
export const FilterApp = () => {
    const [activePanel, setActivePanel] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState(new Set());

    const counts = useMemo(() => {
        let cancerTypeSelected = 0;
        let dataTypeSelected = 0;
        let accessibilitySelected = 0;

        selectedFilters.forEach(id => {
            const details = filterDetailsMap.get(id);
            if (!details) return;

            if (details.group === 'cancer-type') {
                cancerTypeSelected++;
            } else if (details.group === 'data-type') {
                dataTypeSelected++;
            } else if (details.group === 'access') {
                accessibilitySelected++;
            }
        });

        return {
            total: selectedFilters.size,
            cancer: cancerTypeSelected,
            data: dataTypeSelected,
            access: accessibilitySelected,
        };
    }, [selectedFilters]);

    const handleFilterChange = useCallback((id) => {
        setSelectedFilters(prevFilters => {
            const newFilters = new Set(prevFilters);
            if (newFilters.has(id)) {
                newFilters.delete(id);
            } else {
                newFilters.add(id);
            }
            return newFilters;
        });
    }, []);

    const clearAllFilters = useCallback(() => {
        setSelectedFilters(new Set());
        setActivePanel(null);
    }, []);

    const handleFindStudies = useCallback(() => {
        console.log(`Executing search with ${counts.total} filters.`);
        setActivePanel(null);
    }, [counts.total]);


    const renderPanel = () => {
        const props = { handleFilterChange, selectedFilters };
        switch (activePanel) {
            case 'cancer':
                return (
                    <CancerTypePanel {...props} />
                );
            case 'data':
                return (
                    <DataTypePanel {...props} />
                );
            case 'access':
                return (
                    <AccessibilityPanel {...props} />
                );
            default:
                return null;
        }
    };

    const getNavButtonClasses = (panelKey) => {
        const isActive = activePanel === panelKey;
        const baseClasses = "nav-button flex-1 px-4 py-3 text-lg font-medium border-b-4 sm:border-b-0 sm:border-r transition duration-150";
        const activeClasses = 'bg-gray-100 text-[var(--cruk-pink)] border-[var(--cruk-pink)]';
        const inactiveClasses = 'text-gray-600 hover:bg-gray-50 border-transparent';

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    const isFindStudiesDisabled = counts.total === 0;

    return (
        <div className="p-2 sm:p-8 bg-gray-50">
            <div id="filter-container" className="w-full flex flex-col">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Study Filters</h2>

                {/* --- Filter Navigation Bar --- */}
                <div id="filter-navbar" className="flex flex-col sm:flex-row bg-white rounded-t-xl shadow-lg border-b border-gray-300 overflow-hidden">

                    <button onClick={() => setActivePanel('cancer')} className={getNavButtonClasses('cancer')}>
                        Cancer Type <span className="text-xs opacity-80 font-normal ml-2">({counts.cancer} Selected)</span>
                    </button>
                    <button onClick={() => setActivePanel('data')} className={getNavButtonClasses('data')}>
                        Data Type <span className="text-xs opacity-80 font-normal ml-2">({counts.data} Selected)</span>
                    </button>
                    <button onClick={() => setActivePanel('access')} className={getNavButtonClasses('access')}>
                        Accessibility <span className="text-xs opacity-80 font-normal ml-2">({counts.access} Selected)</span>
                    </button>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex sm:flex-row flex-col">
                        <button onClick={clearAllFilters} className="px-4 py-3 font-medium text-sm sm:text-lg text-gray-500 hover:var(--cruk-pink) hover:text-[var(--cruk-pink)] transition duration-150 border-t sm:border-t-0 sm:border-l">
                            Clear Filters
                        </button>
                        <button
                            onClick={handleFindStudies}
                            className={`bg-[var(--cruk-pink)] text-white font-bold py-3 px-8 shadow-md transition duration-150 ${isFindStudiesDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:var(--cruk-pink)'}`}
                            disabled={isFindStudiesDisabled}
                        >
                            Find Studies ({counts.total})
                        </button>
                    </div>
                </div>
                {/* --- End Navigation Bar --- */}

                {/* --- Filter Chip Area --- */}
                <FilterChipArea selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} />
                {/* --- End Filter Chip Area --- */}

                {/* --- Filter Content Panels --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {renderPanel()}
                </div>
                {/* --- End Filter Content Panels --- */}
            </div>
        </div>
    );
};

// --- PANEL COMPONENTS (All included from knockdown.html) ---

const CancerTypePanel = ({ handleFilterChange, selectedFilters }) => {
    const cancerGroups = filterData['0_0'].children;
    const topographyItems = cancerGroups['0_0_0'].children;
    const histologyItems = cancerGroups['0_0_1'].children;
    const crukTermItems = cancerGroups['0_0_2'].children;

    return (
        <div id="cancer-type-panel" className="md:col-span-3 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-3 sm:p-4 text-gray-600 flex-grow overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Cancer Type Selection</h2>
                <p className="text-sm italic text-gray-500 mb-3">
                    Filter by official pathology classifications (ICD-O) or patient-friendly CRUK terminology. (<span className="text-[var(--cruk-pink)] font-semibold">OR Logic</span>)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ICD-O Grouping */}
                    <div className="md:col-span-2 border p-3 rounded-lg bg-gray-100">
                        <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1">ICD-O Classification</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-md shadow-inner border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-700 mb-2">Topography</h4>
                                <div id="icdo-topography-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                                    <NestedFilterList
                                        items={topographyItems}
                                        {...{handleFilterChange, selectedFilters}}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-md shadow-inner border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-700 mb-2">Histology</h4>
                                <div id="icdo-histology-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                                    <NestedFilterList
                                        items={histologyItems}
                                        {...{handleFilterChange, selectedFilters}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CRUK Cancer Terms */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1">CRUK Cancer Terms</h3>
                        <div id="cruk-terms-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                            <NestedFilterList
                                items={crukTermItems}
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DataTypePanel = ({ handleFilterChange, selectedFilters }) => {
    const dataTypeGroups = filterData['0_2'].children;

    return (
        <div id="data-type-panel" className="md:col-span-3 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-3 sm:p-4 text-gray-600 flex-grow overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Data Type Selection</h2>
                <p className="text-sm italic text-gray-500 mb-2">
                    Select one or more modalities to include in your search. (<span className="text-blue-800 font-semibold">AND Logic</span>)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Biobank Samples (0_2_0) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Biobank Samples</h4>
                        <div id="biobank-samples-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                            <NestedFilterList
                                items={dataTypeGroups['0_2_0'].children}
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>

                    {/* In Vitro Studies (0_2_1) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">In Vitro Studies</h4>
                        <div id="invitro-studies-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                            <NestedFilterList
                                items={dataTypeGroups['0_2_1'].children}
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>

                    {/* Animal Studies (0_2_2) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Animal Studies</h4>
                        <div id="animal-studies-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                            <NestedFilterList
                                items={dataTypeGroups['0_2_2'].children}
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>

                    {/* Patient Studies (0_2_3) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Patient Studies</h4>
                        <div id="patient-studies-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                            <NestedFilterList
                                items={dataTypeGroups['0_2_3'].children}
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AccessibilityPanel = ({ handleFilterChange, selectedFilters }) => {
    const accessibilityItems = Object.values(filterData['0_1'].children);

    return (
        <div id="accessibility-panel" className="md:col-span-3 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-3 sm:p-4 text-gray-600 flex-grow overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Accessibility and Source</h2>
                <p className="text-sm italic text-gray-500 mb-2">
                    Filter by data access level and source. (<span className="text-blue-800 font-semibold">AND Logic</span>)
                </p>
                <div className="h-32 overflow-y-auto pr-2 border p-3 rounded-lg">
                    <div className="space-y-2">
                        {accessibilityItems.map(item => {
                            const fullId = item.id;
                            const isChecked = selectedFilters.has(fullId);
                            return (
                                <div key={item.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={fullId}
                                        className="rounded text-[var(--cruk-pink)] border-gray-300 focus:ring-[var(--cruk-pink)] mr-2 w-4 h-4 cursor-pointer"
                                        data-filter-group="access"
                                        checked={isChecked}
                                        onChange={() => handleFilterChange(fullId)}
                                    />
                                    <label htmlFor={fullId} className="text-gray-700 select-none flex-grow cursor-pointer text-sm">
                                        {item.label} <span className="text-xs text-gray-500 ml-1">({item.count})</span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};


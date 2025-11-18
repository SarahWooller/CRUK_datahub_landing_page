import { filterData } from './filter_data.js';
import { executeFilterLogic } from './filterLogic.js';
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


// --- UTILITY FUNCTIONS FOR LOGIC MESSAGE CALCULATION ---
// Function to calculate the logic message (extracted logic from FilterLogicSummary)
const calculateLogicMessage = (filters, filterType, plusParents, includeParents, getMessage) => {
    const hist = filters.filter(f => filterType(f) === "hist");
    const top = filters.filter(f => filterType(f) === "top" || filterType(f) === "cruk");
    const data = filters.filter(f => filterType(f) === "data");
    const access = filters.filter(f => filterType(f) === "access");

    const messages = [];

    // HIST message: plus_parents and OR
    const hist_plus = plusParents(hist);
    const hist_message = getMessage(hist_plus, "OR");
    if (hist_message) messages.push(hist_message);

    // TOP/CRUK message: plus_parents and OR
    const top_plus = plusParents(top);
    const top_message = getMessage(top_plus, "OR");
    if (top_message) messages.push(top_message);

    // DATA message: include_parents (individually) and OR, then join groups with AND
    const data_messages = data.map(d => {
        const listWithParents = includeParents(d).filter(id => filterDetailsMap.has(id));
        return getMessage(listWithParents, "OR");
    }).filter(Boolean);

    const data_final_message = data_messages.join(" AND ");
    if (data_final_message) messages.push(data_final_message);

    // ACCESS message: simple list and OR
    const access_message = getMessage(access, "OR");
    if (access_message) messages.push(access_message);

    return messages.join(" AND ");
};
// --- END UTILITY FUNCTIONS ---


// --- ALL REACT COMPONENTS FROM knockdown.html START HERE ---
const { useState, useMemo, useCallback, useEffect } = React;

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
                        {/* Chevron Right Icon (inline SVG) - FIX APPLIED HERE */}
                        <svg
                            className="w-3 h-3 transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
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

// --- LOGIC UTILITY FUNCTIONS (RE-DEFINED FOR EXPORT/REUSE) ---
const filterType = (id) => {
    const info = id.split("_");
    if (info.length < 3) return "unknown";

    const first = info[1];
    if (first === "2") {
        return "data"; // 0_2_...
    } else if (first === "1") {
        return "access"; // 0_1_...
    } else {
        // first === "0"
        const second = info[2];
        if (second === "1") {
            return "hist"; // 0_0_1_...
        } else if (second === "0") {
            return "top"; // 0_0_0_...
        }
        if (second === "2") return "cruk";

        return "unknown";
    }
};

const includeParents = (f) => {
    if (f) {
        const nms = f.split("_");
        if (nms[1] !== "1" && nms.length > 3) {
            const parents = [];
            for (let k = 4; k <= nms.length; k++) {
                parents.push(nms.slice(0, k).join("_"));
            }
            return parents;
        }
    }
    return [f];
};

const plusParents = (filters) => {
    if (!filters || filters.length === 0) return [];

    const allFilters = new Set();
    filters.forEach(f => {
        includeParents(f).forEach(parentOrSelf => {
            allFilters.add(parentOrSelf);
        });
    });

    return Array.from(allFilters).filter(id => filterDetailsMap.has(id));
};

const getMessage = (thelist, joiner) => {
    const length = thelist.length;
    if (length === 0) {
        return "";
    } else if (length === 1) {
        return filterDetailsMap.get(thelist[0])?.label || "";
    } else {
        const terms = thelist.map(id => filterDetailsMap.get(id)?.label).filter(Boolean);
        return `(${terms.join(` ${joiner} `)})`;
    }
};

// NEW COMPONENT: Dynamic Logic Summary with Edit/Reset functionality
const FilterLogicSummary = ({
    selectedFilters,
    logicMessage,
    setLogicMessage,
    isMessageManuallyEdited,
    setIsMessageManuallyEdited,
}) => {

    // Handler for user input changes in the textarea
    const handleMessageChange = useCallback((e) => {
        setLogicMessage(e.target.value);
        setIsMessageManuallyEdited(true); // User has edited the message
    }, [setLogicMessage, setIsMessageManuallyEdited]);

    // Handler to reset the message to the automatically generated logic
    const handleReset = useCallback(() => {
        const filters = Array.from(selectedFilters);
        const autoMessage = calculateLogicMessage(filters, filterType, plusParents, includeParents, getMessage);
        setLogicMessage(autoMessage);
        setIsMessageManuallyEdited(false); // Reset edit state
    }, [selectedFilters, setLogicMessage, setIsMessageManuallyEdited]);


    if (!selectedFilters || selectedFilters.size === 0) {
        return null;
    }

    const showResetButton = isMessageManuallyEdited;

    // Display
    return (
        <div className="p-1 mt-2 border-t border-gray-200">
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-700 font-semibold">
                    Filter Logic: once you have chosen your filters you can adjust the logic below.
                </p>
                {showResetButton && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs text-blue-600 hover:text-blue-800 transition duration-150 font-medium py-1 px-2 rounded border border-blue-300 hover:bg-blue-50"
                    >
                        Reset to Auto Logic
                    </button>
                )}
            </div>
            <textarea
                id="logic-summary-message"
                className="w-full text-xs text-gray-800 bg-gray-50 p-2 rounded break-words font-mono border border-gray-300 resize-y focus:ring-[var(--cruk-pink)] focus:border-[var(--cruk-pink)]"
                value={logicMessage || "No filters selected"}
                onChange={handleMessageChange}
                rows={Math.max(2, Math.ceil((logicMessage || "No filters selected").length / 100))} // Dynamic rows
            />

            {isMessageManuallyEdited && (
                 <p className="text-xs text-orange-600 mt-1">Note: Filter logic has been manually edited. If you need to add filters reset logic first</p>
            )}
        </div>
    );
};

// Export utility functions for use in VertFilterApp's useEffect
FilterLogicSummary.utilityFunctions = { filterType, plusParents, includeParents, getMessage };
// --- END LOGIC SUMMARY COMPONENT ---


// Component for the dynamic chips display
const FilterChipArea = ({
    selectedFilters,
    handleFilterChange,
    logicMessage,
    setLogicMessage,
    isMessageManuallyEdited,
    setIsMessageManuallyEdited,
}) => {

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

            {/* Now using the dynamic, logic-compliant summary component */}
            <FilterLogicSummary
                selectedFilters={selectedFilters}
                logicMessage={logicMessage}
                setLogicMessage={setLogicMessage}
                isMessageManuallyEdited={isMessageManuallyEdited}
                setIsMessageManuallyEdited={setIsMessageManuallyEdited}
            />
        </div>
    );
};



// Main Application Component
export const VertFilterApp = () => {
    const [activePanel, setActivePanel] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState(new Set());
    // NEW STATE FOR EDITABLE LOGIC MESSAGE
    const [logicMessage, setLogicMessage] = useState("");
    const [isMessageManuallyEdited, setIsMessageManuallyEdited] = useState(false);
    // END NEW STATE

    // NEW SEARCH STATE
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIds, setFilteredIds] = useState(null); // Set of IDs that match the current search
    const [isSearching, setIsSearching] = useState(false); // Flag for search status

    // Flatten all data for efficient searching
    const allFiltersArray = useMemo(() => Array.from(filterDetailsMap.values()), []);

    // Reuse the filter logic utilities from FilterLogicSummary
    const { filterType, plusParents, includeParents, getMessage } = FilterLogicSummary.utilityFunctions;

    // EFFECT to update logicMessage when filters change (unless manually edited)
    useEffect(() => {
        // Only calculate if the user hasn't manually overridden the message
        if (!isMessageManuallyEdited) {
            const filters = Array.from(selectedFilters);
            const newMessage = calculateLogicMessage(filters, filterType, plusParents, includeParents, getMessage);
            setLogicMessage(newMessage);
        }
    }, [selectedFilters, isMessageManuallyEdited, filterType, plusParents, includeParents, getMessage]);

    // NEW SEARCH EFFECT WITH DEBOUNCE AND MIN LENGTH
    useEffect(() => {
        // Clear search results if the term is too short or empty
        if (!searchTerm || searchTerm.length < 4) {
            setFilteredIds(null);
            setIsSearching(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsSearching(true);

            const activeGroupMap = {
                'cancer': 'cancer-type',
                'data': 'data-type',
                'access': 'access'
            };
            const activeGroup = activeGroupMap[activePanel];

            if (!activeGroup) {
                setFilteredIds(null);
                setIsSearching(false);
                return;
            }

            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            const results = allFiltersArray.filter(item => {
                // 1. Check if the item belongs to the active panel's group
                if (item.group !== activeGroup) return false;

                // 2. Perform case-insensitive search on the label
                return item.label.toLowerCase().includes(lowerCaseSearchTerm);
            });

            const newFilteredIds = new Set(results.map(item => item.id));
            setFilteredIds(newFilteredIds);
            setIsSearching(false);

        }, 300); // Debounce delay

        return () => clearTimeout(timer); // Cleanup function to clear the previous timer
    }, [searchTerm, activePanel, allFiltersArray]);

    // NEW HIERARCHY PRUNING UTILITY
    const pruneHierarchy = useCallback((nodes, currentFilteredIds) => {
        if (!nodes) return null;
        if (!currentFilteredIds) return nodes; // No search active, return all nodes

        const filteredNodes = {};
        const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);

        nodesArray.forEach(item => {
            // Recursively prune children first
            const filteredChildren = pruneHierarchy(item.children, currentFilteredIds);

            // Check if the current item is a match, or if any of its children matched
            const isMatch = currentFilteredIds.has(item.id);
            const hasMatchingChildren = filteredChildren && Object.keys(filteredChildren).length > 0;

            if (isMatch || hasMatchingChildren) {
                // Include this node (and its filtered children)
                const newNode = { ...item };
                if (filteredChildren) {
                    newNode.children = filteredChildren;
                }
                filteredNodes[item.id] = newNode;
            }
        });

        return Object.keys(filteredNodes).length > 0 ? filteredNodes : null;
    }, []);


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
        setSearchTerm(''); // Clear search on filter clear
        setLogicMessage(''); // NEW: Clear message
        setIsMessageManuallyEdited(false); // NEW: Reset edit state
    }, []);

    const handleFindStudies = useCallback(() => {
        // Log the current action
        console.log(`Executing search with ${counts.total} filters. Current logic message: ${logicMessage}`);

        // 1. Check if filters are selected
        if (counts.total > 0 && logicMessage) {
            // 2. Execute the filter logic from the external utility file
            const results = executeFilterLogic(logicMessage);

            // 3. You can use the results object to update UI or perform further actions
            if (results.success) {
                // Example: Update the total count found in the button label or display the results studies
                console.log(`Successfully found ${results.count} studies.`);
            }
        } else {
             // Optional: Alert the user if they press Find Studies with no filters (though button is disabled)
             console.log("No studies to find. Please select filters first.");
        }

        // Close the panel after finding studies
        setActivePanel(null);

    }, [counts.total, logicMessage]); // Dependencies remain the same


    const renderPanel = () => {
        const props = {
            handleFilterChange,
            selectedFilters,
            searchTerm,
            setSearchTerm,
            filteredIds,
            isSearching,
            pruneHierarchy // Pass utility down
        };
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
        const baseClasses = "nav-button w-full px-4 py-3 text-left text-lg font-medium border-l-4 transition duration-150";
        const activeClasses = 'bg-gray-100 text-[var(--cruk-pink)] border-[var(--cruk-pink)]';
        const inactiveClasses = 'text-gray-600 hover:bg-gray-50 border-transparent';

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    const isFindStudiesDisabled = counts.total === 0;

    return (
        <div className="p-2 sm:p-8 bg-gray-50">
            <div id="filter-container" className="w-full flex flex-col">


                {/* Main Filter Layout: Vertical Nav (1/4 width) and Horizontal Content (3/4 width) */}
                <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">

                    {/* --- Vertical Filter Navigation Bar (Left Panel) --- */}
                    <div id="filter-navbar" className="flex flex-col flex-shrink-0 w-full md:w-1/4 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
                        <h2 className="p-4 text-3xl sm:text-4xl font-bold text-[var(--cruk-blue)]">Study Filters</h2>
                        {/* Category Buttons - CLEAR SEARCH TERM WHEN SWITCHING PANELS */}
                        <button onClick={() => { setActivePanel('cancer'); setSearchTerm(''); }} className={getNavButtonClasses('cancer')}>
                            Cancer Type <span className="text-sm opacity-80 font-normal ml-2">({counts.cancer} Selected)</span>
                        </button>
                        <button onClick={() => { setActivePanel('data'); setSearchTerm(''); }} className={getNavButtonClasses('data')}>
                            Data Type <span className="text-sm opacity-80 font-normal ml-2">({counts.data} Selected)</span>
                        </button>
                        <button onClick={() => { setActivePanel('access'); setSearchTerm(''); }} className={getNavButtonClasses('access')}>
                            Accessibility <span className="text-sm opacity-80 font-normal ml-2">({counts.access} Selected)</span>
                        </button>
                        {/* Action Buttons */}
                            <button onClick={clearAllFilters} className="px-4 py-2 font-medium text-sm text-gray-500 hover:var(--cruk-pink) hover:text-[var(--cruk-pink)] transition duration-150 bg-white rounded-lg shadow-sm border border-gray-300">
                                Clear Filters
                            </button>
                            <button
                                onClick={handleFindStudies}
                                className={`bg-[var(--cruk-pink)] text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-150 ${isFindStudiesDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                                disabled={isFindStudiesDisabled}
                            >
                                Find Studies ({counts.total})
                            </button>


                    </div>
                    {/* --- End Vertical Navigation Bar --- */}

                    {/* --- Filter Content Panel (Right Panel) --- */}
                    <div className="flex-grow w-full md:w-3/4 p-0">
                        {/* Filter Chip Area (Includes the new Logic Summary) */}
                        <FilterChipArea
                            selectedFilters={selectedFilters}
                            handleFilterChange={handleFilterChange}
                            logicMessage={logicMessage}
                            setLogicMessage={setLogicMessage}
                            isMessageManuallyEdited={isMessageManuallyEdited}
                            setIsMessageManuallyEdited={setIsMessageManuallyEdited}
                        />

                        {/* Filter Panel Content / Default Content */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* 1. Render the filter panel ONLY if active */}
                            {activePanel && renderPanel()}
                        </div>
                    </div>
                    {/* --- End Filter Content Panel --- */}
                </div>
            </div>
        </div>
    );
};

// --- PANEL COMPONENTS (MODIFIED TO INCLUDE SEARCH) ---

const SearchInput = ({ searchTerm, setSearchTerm, isSearching, placeholder }) => {
    return (
        <div className="mb-4">
            <div className="relative">
                <input
                    type="search"
                    placeholder={placeholder || "Search terms (min 4 characters)..."}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-[var(--cruk-pink)] focus:border-[var(--cruk-pink)] text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* Search Icon or Loading Spinner */}
                    {isSearching ? (
                         <svg className="animate-spin h-5 w-5 text-[var(--cruk-pink)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    )}
                </div>
            </div>
            {searchTerm && searchTerm.length < 4 && (
                <p className="text-xs text-red-500 mt-1">Please enter at least 4 characters to search.</p>
            )}
        </div>
    );
};

const CancerTypePanel = ({ handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching, pruneHierarchy }) => {
    const cancerGroups = filterData['0_0'].children;
    const primaryGroup = filterData['0_0'].primaryGroup;

    // Apply pruning logic to each main group
    const filteredTopographyItems = pruneHierarchy(cancerGroups['0_0_0'].children, filteredIds);
    const filteredHistologyItems = pruneHierarchy(cancerGroups['0_0_1'].children, filteredIds);
    const filteredCrukTermItems = pruneHierarchy(cancerGroups['0_0_2'].children, filteredIds);

    return (
        <div id="cancer-type-panel" className="md:col-span-3 bg-white rounded-xl overflow-hidden flex flex-col">
            <div className="p-3 sm:p-4 text-gray-600 flex-grow overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Cancer Type Selection</h2>

                {/* Search Bar for Cancer Terms */}
                <SearchInput
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isSearching={isSearching}
                    placeholder="Search Cancer/ICD-O terms"
                />

                <p className="text-sm italic text-gray-500 mb-3">
                    Filter by official pathology classifications (ICD-O) or patient-friendly CRUK terminology.
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
                                        items={filteredTopographyItems} // USE FILTERED DATA
                                        {...{handleFilterChange, selectedFilters}}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-md shadow-inner border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-700 mb-2">Histology</h4>
                                <div id="icdo-histology-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                                    <NestedFilterList
                                        items={filteredHistologyItems} // USE FILTERED DATA
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
                                items={filteredCrukTermItems} // USE FILTERED DATA
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DataTypePanel = ({ handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching, pruneHierarchy }) => {
    const dataTypeGroups = filterData['0_2'].children;
    const primaryGroup = filterData['0_2'].primaryGroup;

    // Apply pruning logic to each main group
    const filteredBiobankItems = pruneHierarchy(dataTypeGroups['0_2_0'].children, filteredIds);
    const filteredInvitroItems = pruneHierarchy(dataTypeGroups['0_2_1'].children, filteredIds);
    const filteredAnimalItems = pruneHierarchy(dataTypeGroups['0_2_2'].children, filteredIds);
    const filteredPatientItems = pruneHierarchy(dataTypeGroups['0_2_3'].children, filteredIds);

    return (
        <div id="data-type-panel" className="md:col-span-3 bg-white rounded-xl overflow-hidden flex flex-col">
            <div className="p-3 sm:p-4 text-gray-600 flex-grow overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Data Type Selection</h2>

                {/* Search Bar for Data Terms */}
                <SearchInput
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isSearching={isSearching}
                    placeholder="Search data types"
                />

                <p className="text-sm italic text-gray-500 mb-2">
                    Select one or more modalities to include in your search.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Biobank Samples (0_2_0) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Biobank Samples</h4>
                        <div id="biobank-samples-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                            <NestedFilterList
                                items={filteredBiobankItems} // USE FILTERED DATA
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>

                    {/* In Vitro Studies (0_2_1) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">In Vitro Studies</h4>
                        <div id="invitro-studies-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                            <NestedFilterList
                                items={filteredInvitroItems} // USE FILTERED DATA
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>

                    {/* Animal Studies (0_2_2) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Animal Studies</h4>
                        <div id="animal-studies-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                            <NestedFilterList
                                items={filteredAnimalItems} // USE FILTERED DATA
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>

                    {/* Patient Studies (0_2_3) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Patient Studies</h4>
                        <div id="patient-studies-list" className="h-40 overflow-y-auto space-y-1 text-sm pr-2">
                            <NestedFilterList
                                items={filteredPatientItems} // USE FILTERED DATA
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AccessibilityPanel = ({ handleFilterChange, selectedFilters, searchTerm, setSearchTerm, filteredIds, isSearching, pruneHierarchy }) => {
    const accessibilityItems = Object.values(filterData['0_1'].children);
    const primaryGroup = filterData['0_1'].primaryGroup;

    // Accessibility items are flat, so we just filter them here if a search is active
    const finalAccessibilityItems = useMemo(() => {
        if (!filteredIds) {
            return accessibilityItems;
        }

        return accessibilityItems.filter(item => filteredIds.has(item.id));
    }, [accessibilityItems, filteredIds]);


    return (
        <div id="accessibility-panel" className="md:col-span-3 bg-white rounded-xl overflow-hidden flex flex-col">
            <div className="p-3 sm:p-4 text-gray-600 flex-grow overflow-hidden">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Accessibility and Source</h2>

                {/* Search Bar for Accessibility Terms */}
                <SearchInput
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isSearching={isSearching}
                    placeholder="Search accessibility/source terms"
                />

                <p className="text-sm italic text-gray-500 mb-2">
                    Filter by data access level and source.
                </p>
                <div className="h-32 overflow-y-auto pr-2 border p-3 rounded-lg">
                    <div className="space-y-2">
                        {/* Render the filtered or full list */}
                        {finalAccessibilityItems.map(item => {
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
                        {/* If search is active but results are empty */}
                        {isSearching === false && searchTerm.length >= 4 && finalAccessibilityItems.length === 0 && (
                            <p className="text-sm text-gray-500">No results found for "{searchTerm}".</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
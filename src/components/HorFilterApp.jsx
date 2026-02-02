import { filterDetailsMap, filterData } from '../utils/filter-setup';
import { filterType, includeParents, plusParents, getMessage, calculateLogicMessage
} from '../utils/logic-utils';
import { executeFilterLogic } from '../utils/filterLogic.js';
import React from 'react'; // React is now imported from node_modules
import "../styles/style.css"


// --- UTILITY FUNCTIONS FOR LOGIC MESSAGE CALCULATION ---


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

    // Check if description exists
    const hasDescription = item.description && item.description.trim().length > 0;

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
            {/* FIX 1: Removed 'relative' and 'hover:z-30' from this main row.
               This stops the "stuttering" and "unwanted shading" glitch.
            */}
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
                        {/* Chevron Right Icon */}
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

                {/* FIX 2: Applied 'relative' and 'hover:z-20' here instead.
                   This ensures the label (and tooltip) sits on top of the next row
                   without messing up the layout of the current row.
                */}
                <div className="relative flex-grow flex items-center group/tooltip hover:z-20">
                    <label
                        htmlFor={fullId}
                        className="text-gray-700 select-none flex-grow cursor-pointer text-sm flex items-center"
                    >
                        {item.label}
                        {/* <span className="text-xs text-gray-500 ml-1">({item.count})</span> */}

                        {hasDescription && (
                            <svg className="w-3 h-3 ml-1 text-gray-400 opacity-50 group-hover/tooltip:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        )}
                    </label>

                    {/* TOOLTIP POPUP */}
                    {hasDescription && (
                        /* FIX 3: Changed to 'top-full' (Below) and added 'mt-1'.
                           This lowers the tooltip so it doesn't clip off the top filter.
                        */
                        <div className="absolute top-full left-4 mt-1 hidden group-hover/tooltip:block w-64 p-2 bg-[var(--cruk-blue)] text-white text-xs rounded shadow-xl cursor-auto whitespace-normal">
                            {item.description}

                            {/* Arrow pointing UP (Attached to top of tooltip) */}
                            <div className="absolute bottom-full left-4 -mb-px border-4 border-transparent border-b-[var(--cruk-blue)]"></div>
                        </div>
                    )}
                </div>
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

// Export utility functions for use in FilterApp's useEffect
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

// --- NEW COMPONENT: Help Overlay ---
const HelpOverlay = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-3xl font-bold text-[var(--cruk-blue)]">How to use filters</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6 text-lg text-gray-700">

                        <section>
                            <p>The list of studies can be filtered to pick out those with relating to specific cancers, including particular data or matching your accessibility needs.</p>
                        </section>

                        <section>
                            <h3 className="font-bold text-[var(--cruk-pink)] mb-2">1. Selecting Categories</h3>
                            <p>Use the top tabs to switch between <strong>Cancer Type</strong>, <strong>Data Type</strong>, and <strong>Accessibility</strong> categories.</p>
                            <p>You can search for cancers using CRUK terms, TCGA codes, or ICD-O classifications.</p>
                        </section>

                        <section>
                            <h3 className="font-bold text-[var(--cruk-pink)] mb-2">2. Searching for Terms</h3>
                            <p>In each category, use the search bar to find specific terms. You must enter at least <strong>4 characters</strong> to start the search.</p>
                        </section>

                        <section>
                            <h3 className="font-bold text-[var(--cruk-pink)] mb-2">3. Expanding Options</h3>
                            <p>Wherever there is a <strong>chevron (&gt;)</strong> next to a filter name, you can click to see more specific sub-categories.</p>
                        </section>

                        <section>
                            <h3 className="font-bold text-[var(--cruk-pink)] mb-2">4. Adjusting Logic</h3>
                            <p>Filters appear as chips. You can manually edit the <strong>Filter Logic</strong> text box if you need to combine filters using specific logic (e.g., AND/OR).</p>
                        </section>
                    </div>

                    <div className="mt-8 pt-4 border-t flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-[var(--cruk-blue)] text-white font-bold py-2 px-6 rounded-lg hover:opacity-90"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Application Component
export const FilterApp = () => {
    const [activePanel, setActivePanel] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState(new Set());
    const [logicMessage, setLogicMessage] = useState("");
    const [isMessageManuallyEdited, setIsMessageManuallyEdited] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
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
            // If the message was manually edited, adding a new filter should reset the state
            if (isMessageManuallyEdited) {
                setIsMessageManuallyEdited(false);
            }
            return newFilters;
        });
    }, [isMessageManuallyEdited]); // Added isMessageManuallyEdited to dependency array

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
        // Adjusted base classes for horizontal layout
        const baseClasses = "nav-button flex-grow px-4 py-3 text-center text-lg font-medium border-b-4 transition duration-150";
        // Switched to 'border-b-4' and made it pink when active
        const activeClasses = 'bg-white text-[var(--cruk-pink)] border-[var(--cruk-pink)]';
        const inactiveClasses = 'text-gray-600 hover:bg-gray-50 border-transparent';

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    const isFindStudiesDisabled = counts.total === 0;

    return (
        <div className="p-2 sm:p-8 bg-gray-50">
            <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
            <div id="filter-container" className="w-full flex flex-col">

                {/* Main Filter Layout: New Horizontal Nav (Top) and Content/Actions (Below) */}
                <div className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">

                    {/* --- Horizontal Filter Navigation Bar (Top Row) --- */}
                    <div id="filter-navbar" className="flex flex-col sm:flex-row flex-shrink-0 w-full bg-gray-50 border-b border-gray-200">
                        {/* Title and Category Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-stretch sm:w-3/4">
                            <div className="p-4 sm:pr-8 sm:w-1/4 flex items-center justify-between border-b sm:border-b-0 sm:border-r border-gray-200">
                                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--cruk-blue)]">
                                    Study Filters
                                </h2>
                                <button
                                    onClick={() => setShowHelp(true)}
                                    className="ml-4 px-3 py-1 font-bold text-xs text-white bg-[var(--cruk-blue)] rounded-lg shadow-sm hover:opacity-90 transition duration-150 whitespace-nowrap"
                                >
                                    Help
                                </button>
                            </div>
                            {/* Category Buttons - CLEAR SEARCH TERM WHEN SWITCHING PANELS */}
                            <div className="flex flex-grow justify-around sm:w-3/4">
                                <button onClick={() => { setActivePanel('cancer'); setSearchTerm(''); }} className={getNavButtonClasses('cancer')}>
                                    Cancer Type <span className="text-sm opacity-80 font-normal ml-2">({counts.cancer} Selected)</span>
                                </button>
                                <button onClick={() => { setActivePanel('data'); setSearchTerm(''); }} className={getNavButtonClasses('data')}>
                                    Data Type <span className="text-sm opacity-80 font-normal ml-2">({counts.data} Selected)</span>
                                </button>
                                <button onClick={() => { setActivePanel('access'); setSearchTerm(''); }} className={getNavButtonClasses('access')}>
                                    Accessibility <span className="text-sm opacity-80 font-normal ml-2">({counts.access} Selected)</span>
                                </button>
                            </div>
                        </div>

                          {/* Action Buttons (Right Side of Horizontal Nav) - Help removed from here */}
                        <div className="flex flex-row sm:flex-col sm:w-1/4 p-2 sm:p-2 border-t sm:border-t-0 sm:border-l border-gray-200 justify-around items-center space-x-2 sm:space-x-0 sm:space-y-2">
                            <button
                                onClick={clearAllFilters}
                                className="w-1/2 sm:w-auto px-4 py-2 font-medium text-sm text-gray-500 hover:text-[var(--cruk-pink)] transition duration-150 bg-white rounded-lg shadow-sm border border-gray-300"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleFindStudies}
                                className={`w-1/2 sm:w-auto bg-[var(--cruk-pink)] text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-150 ${isFindStudiesDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                                disabled={isFindStudiesDisabled}
                            >
                                Find ({counts.total})
                            </button>
                        </div>
                    </div>
                      {/* --- End Horizontal Navigation Bar --- */}

                    {/* --- Filter Content Panel (Content Below Nav) --- */}
                    <div className="flex-grow w-full p-0">
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
                            {activePanel ? (
                                renderPanel()
                            ) : (
                                null
                            )}
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
    // State to track which classification the user has selected
    const [selectedClassification, setSelectedClassification] = useState(null); // null, 'cruk', 'tcga', 'snomed', 'icdo'

    const cancerGroups = filterData['0_0'].children;

    // --- DATA RETRIEVAL and PRUNING ---
    // ICD-O (Combined Topography and Histology)
    const filteredTopographyItems = pruneHierarchy(cancerGroups['0_0_0']?.children, filteredIds);
    const filteredHistologyItems = pruneHierarchy(cancerGroups['0_0_1']?.children, filteredIds);

    // CRUK (0_0_2)
    const filteredCrukTermItems = pruneHierarchy(cancerGroups['0_0_2']?.children, filteredIds);

    // SNOMED-CT (0_0_3)
    const snomedData = cancerGroups['0_0_3'] || { children: {} };
    const filteredSnomedItems = pruneHierarchy(snomedData.children, filteredIds);

    // TCGA (0_0_4)
    const tcgaData = cancerGroups['0_0_4'] || { children: {} };
    const filteredTcgaItems = pruneHierarchy(tcgaData.children, filteredIds);

    // --- Sub-Component for a Classification Card/Button ---
    const ClassificationCard = ({ title, description, classificationKey, emoji }) => {
        const isActive = selectedClassification === classificationKey;
        const baseClasses = "flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md border-2 transition duration-200 cursor-pointer text-center relative";
        const activeClasses = 'border-[var(--cruk-pink)] ring-4 ring-[var(--cruk-pink)]/20 shadow-lg scale-[1.02]';
        const inactiveClasses = 'border-gray-200 hover:border-[var(--cruk-pink)]/50';

        // Check for filters selected within this group to show a count/badge
        let filterCount = 0;
        if (classificationKey === 'icdo') {
             selectedFilters.forEach(id => {
                 if (id.startsWith('0_0_0') || id.startsWith('0_0_1')) filterCount++;
            });
        } else if (classificationKey === 'cruk' && cancerGroups['0_0_2']) {
             selectedFilters.forEach(id => { if (id.startsWith('0_0_2')) filterCount++; });
        } else if (classificationKey === 'snomed' && cancerGroups['0_0_3']) {
             selectedFilters.forEach(id => { if (id.startsWith('0_0_3')) filterCount++; });
        } else if (classificationKey === 'tcga' && cancerGroups['0_0_4']) {
             selectedFilters.forEach(id => { if (id.startsWith('0_0_4')) filterCount++; });
        }

        return (
            <div
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                onClick={() => setSelectedClassification(classificationKey)}
            >
                <div className="flex items-center space-x-2">
                    <span className="text-3xl">{emoji}</span>
                    <h4 className="text-xl font-bold text-gray-800">{title}</h4>
                </div>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
                {filterCount > 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--cruk-pink)] text-white">
                        {filterCount} Selected
                    </span>
                )}
            </div>
        );
    };

    // --- Content for a selected classification ---
    const renderClassificationContent = () => {
        const listProps = { handleFilterChange, selectedFilters };

        // FIX APPLIED HERE: Added 'pb-28' to allow scrolling space for bottom tooltips
        const baseListClass = "h-[250px] overflow-y-auto space-y-1 text-sm pr-2 pb-28";

        // Display Search Input for all sub-panels
        const searchInput = (
            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isSearching={isSearching}
                placeholder={`Search ${selectedClassification.toUpperCase()} terms`}
            />
        );

        switch (selectedClassification) {
            case 'cruk':
                return (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">CRUK Cancer Terms </h3>
                        {searchInput}
                        <div id="cruk-terms-list" className={baseListClass}>
                            <NestedFilterList
                                items={filteredCrukTermItems}
                                {...listProps}
                            />
                        </div>
                    </>
                );

            case 'tcga':
                return (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">TCGA Terms </h3>
                        {searchInput}
                        <div id="tcga-terms-list" className={baseListClass}>
                            <NestedFilterList
                                items={filteredTcgaItems}
                                {...listProps}
                            />
                        </div>
                    </>
                );

            case 'snomed':
                return (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">SNOMED-CT Terms</h3>
                        {searchInput}
                        <div id="snomed-terms-list" className={baseListClass}>
                            <NestedFilterList
                                items={filteredSnomedItems}
                                {...listProps}
                            />
                        </div>
                    </>
                );

            case 'icdo':
                return (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">ICD-O Classification</h3>
                        {searchInput}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-md shadow-inner border border-gray-200">
                                <h4 className="text-base font-bold text-gray-700 mb-2">Topography</h4>
                                <div id="icdo-topography-list" className={baseListClass}>
                                    <NestedFilterList
                                        items={filteredTopographyItems}
                                        {...listProps}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-md shadow-inner border border-gray-200">
                                <h4 className="text-base font-bold text-gray-700 mb-2">Histology</h4>
                                <div id="icdo-histology-list" className={baseListClass}>
                                    <NestedFilterList
                                        items={filteredHistologyItems}
                                        {...listProps}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };


    // --- Main Panel Render Logic ---
    return (
        <div id="cancer-type-panel" className="md:col-span-3 bg-white rounded-xl overflow-hidden flex flex-col">
            <div className="p-3 sm:p-4 text-gray-600 flex-grow overflow-hidden">
                <div className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2">
                    {selectedClassification && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedClassification(null);
                                    setSearchTerm("");
                                }}
                                className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                            >
                                ← Back to Cancer Type Selection
                            </button>
                        )}
                </div>
                {!selectedClassification && (
                    <div className="mt-4">
                        <p className="text-lg font-medium text-gray-700 mb-6">
                            Click on your choice of classification to begin
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <ClassificationCard
                                title="CRUK Cancer Terms"
                                description="Patient-friendly, simplified cancer terms."
                                classificationKey="cruk"
                                emoji="🏥"
                            />
                            <ClassificationCard
                                title="TCGA Terms"
                                description="The Cancer Genome Atlas terminology."
                                classificationKey="tcga"
                                emoji="🧬"
                            />
                            <ClassificationCard
                                title="SNOMED-CT"
                                description="Systematized Nomenclature of Medicine."
                                classificationKey="snomed"
                                emoji="🏷️"
                            />
                            <ClassificationCard
                                title="ICD-O Classification"
                                description="Official pathology terms (Topography & Histology)."
                                classificationKey="icdo"
                                emoji="🔬"
                            />
                        </div>
                    </div>
                )}

                {/* Detailed Filter Content */}
                {selectedClassification && (
                    <div className="mt-4 border p-4 rounded-lg bg-gray-50">
                        {renderClassificationContent()}
                    </div>
                )}
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
    const filteredNonBioItems = pruneHierarchy(dataTypeGroups['0_2_4'].children, filteredIds);

    // Helper class for the lists: Added 'pb-28' for tooltip space
    const listClass = "h-40 overflow-y-auto space-y-1 text-sm pr-2 pb-28";

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* Biobank Samples (0_2_0) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Biobank Samples</h4>
                        <div id="biobank-samples-list" className={listClass}>
                            <NestedFilterList
                                items={filteredBiobankItems} // USE FILTERED DATA
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>

                    {/* In Vitro Studies (0_2_1) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">In Vitro Studies</h4>
                        <div id="invitro-studies-list" className={listClass}>
                            <NestedFilterList
                                items={filteredInvitroItems} // USE FILTERED DATA
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>

                    {/* Model Organisms (0_2_2) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Model Organisms</h4>
                        <div id="animal-studies-list" className={listClass}>
                            <NestedFilterList
                                items={filteredAnimalItems} // USE FILTERED DATA
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>

                    {/* Patient Studies (0_2_3) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Patient Studies</h4>
                        <div id="patient-studies-list" className={listClass}>
                            <NestedFilterList
                                items={filteredPatientItems} // USE FILTERED DATA
                                {...{handleFilterChange, selectedFilters}}
                            />
                        </div>
                    </div>
                    {/* Techniques (0_2_4) */}
                    <div className="border p-3 rounded-lg bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">Techniques</h4>
                        <div id="techniques-studies-list" className={listClass}>
                            <NestedFilterList
                                items={filteredNonBioItems} // USE FILTERED DATA
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

                {/* FIX APPLIED HERE: Added 'pb-28' to the container */}
                <div className="h-32 overflow-y-auto pr-2 border p-3 rounded-lg pb-28">
                    <div className="space-y-2">
                        {/* Render the filtered or full list */}
                        {finalAccessibilityItems.map(item => {
                            const fullId = item.id;
                            const isChecked = selectedFilters.has(fullId);
                            // NOTE: Tooltip logic isn't in a separate component here,
                            // but if you want tooltips here too, you'd need to duplicate the logic
                            // or use NestedFilterItem here as well.
                            // Assuming you just want the scrolling space for consistency:
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
                        {isSearching === false && searchTerm.length >= 4 && finalAccessibilityItems.length === 0 && (
                            <p className="text-sm text-gray-500">No results found for "{searchTerm}".</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
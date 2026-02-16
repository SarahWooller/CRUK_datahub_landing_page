import React, { useState, useMemo, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// 1. IMPORT DATA FROM UTILS
import studyData from '../utils/dummy_data/optimam_partial.json';
import { filterData } from '../utils/longer_filter_data.js';
import FeedbackModal from './FeedbackModal.jsx';
import FeedbackFallback from './FeedbackFallback.jsx';
import { useFeedback } from '../hooks/useFeedback';
import viewQuestions from '../feedback/meta_data_questions.json';

// 2. IMPORT ICONS
import animalIcon from '../assets/animal.webp';
import backgroundIcon from '../assets/background.webp';
import biobankIcon from '../assets/biobank.webp';
import invitroIcon from '../assets/invitro.webp';
import longitudinalIcon from '../assets/longitudinal.webp';
import treatmentsIcon from '../assets/treatments.webp';
import omicsIcon from '../assets/omics.webp';
import imagingIcon from '../assets/medical_imaging.webp';
import labResultsIcon from '../assets/lab_results.webp';

// 3. IMPORT ERD IMAGE
import erdImage from '../assets/erd.png';

// --- Configuration ---
const ICON_MAPPING = {
  "Model Organisms": { src: animalIcon, label: "Model Organisms" },
  "Background": { src: backgroundIcon, label: "Background" },
  "Biobank Samples": { src: biobankIcon, label: "Biobank Samples" },
  "In Vitro Studies": { src: invitroIcon, label: "In Vitro Studies" },
  "Longitudinal Follow up": { src: longitudinalIcon, label: "Longitudinal" },
  "Treatments": { src: treatmentsIcon, label: "Treatments" },
  "Multi-omic Data": { src: omicsIcon, label: "Multi-omic Data" },
  "Imaging types": { src: imagingIcon, label: "Imaging Data" }, // Updated key to match new JSON
  "Imaging Data": { src: imagingIcon, label: "Imaging Data" },   // Fallback
  "Biopsy Results and Lab Reports": { src: labResultsIcon, label: "Lab Results" }
};

// --- Utility Functions ---

/**
 * Flattens the nested filter tree into a Map for O(1) lookup.
 */
const flattenFilterTree = (nodes, parentPath = []) => {
    let map = {};
    if (!nodes || typeof nodes !== 'object') return map;

    Object.values(nodes).forEach(node => {
        const currentPath = [...parentPath, node.label];
        const fullPathString = currentPath.join(" > ");

        map[node.id] = {
            label: node.label,
            fullPath: fullPathString,
            rawPath: currentPath
        };

        if (node.children) {
            Object.assign(map, flattenFilterTree(node.children, currentPath));
        }
    });
    return map;
};

/**
 * Categorizes an ID based on specific prefixes.
 */
/**
 * Maps an ID to a Group, a specific Category Label, and path visibility settings.
 */
const getFilterConfig = (id) => {
    // --- CANCER FILTERS ---
    // CRUK Terms (0_0_2): Bold label only, no path
    if (id.startsWith("0_0_2")) return { group: "Cancer Filters", category: "CRUK Cancer Terms", showPath: false };

    // TCGA Terms (0_0_4): Bold label only, no path
    if (id.startsWith("0_0_4")) return { group: "Cancer Filters", category: "TCGA Terms", showPath: false };

    // ICD-O Topography (0_0_0): Show path (sliced)
    if (id.startsWith("0_0_0")) return { group: "Cancer Filters", category: "ICD-O Topography", showPath: true, slice: 2 };

    // ICD-O Histology (0_0_1): Show path (sliced)
    if (id.startsWith("0_0_1")) return { group: "Cancer Filters", category: "ICD-O Histology", showPath: true, slice: 2 };

    // General Cancer fallback
    if (id.startsWith("0_0")) return { group: "Cancer Filters", category: "Other Cancer Types", showPath: true, slice: 1 };

    // --- DATA FILTERS ---
    // Data Types (0_2): Show path (sliced)
    if (id.startsWith("0_2")) return { group: "Data Filters", category: "Data Types", showPath: true, slice: 1 };

    // --- ACCESS FILTERS ---
    // Access Types (0_1): Bold label only, no path
    if (id.startsWith("0_1")) return { group: "Access Filters", category: "Access Types", showPath: false };

    return { group: "Other Filters", category: "Miscellaneous", showPath: true, slice: 0 };
};



const getFirstTwoSentences = (text) => {
  if (!text) return "";
  const match = text.match(/^.*?[.!?](?:\s|$)(?:.*?[.!?](?:\s|$))?/);
  return match ? match[0] : text;
};

// Updated to handle both Array (New Schema) and String (Old Schema)
const normalizeList = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return input.split(';,;').map(k => k.trim());
};

// Updated to extract icons from filters.Data Types
const getActiveIcons = (filters) => {
  const activeKeys = new Set();
  const targetKeys = Object.keys(ICON_MAPPING);

  // Safety check to ensure filters and Data Types exist
  if (!filters || !filters["Data Types"]) return [];

  const dataTypes = filters["Data Types"];

  // Iterate over categories in Data Types (e.g., "Patient Study")
  Object.values(dataTypes).forEach(list => {
    if (Array.isArray(list)) {
      list.forEach(item => {
        // 1. Handle Strings (e.g., "Background", "Multi-omic Data")
        if (typeof item === 'string') {
          console.log(item);
          if (targetKeys.includes(item)) {
            activeKeys.add(item);
          }
        }
        // 2. Handle Objects (e.g., {"Imaging Data": "Radiographic imaging"})
        else if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => {
            if (targetKeys.includes(key)) {
              activeKeys.add(key);
            }
          });
        }
      });
    }
  });

  return Array.from(activeKeys).map(key => ICON_MAPPING[key]);
};



// --- Sub-Components ---

const StatCard = ({ label, value, colorClass }) => (
  <div className={`p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center ${colorClass}`}>
    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</span>
    <span className="text-lg font-semibold text-gray-800 break-words w-full">{value}</span>
  </div>
);

const SectionHeading = ({ id, title, children }) => (
  <div className="flex justify-between items-end mt-10 mb-4 pb-2 border-b border-gray-200">
      <h2 id={id} className="text-2xl font-bold text-gray-800">
        {title}
      </h2>
      {children}
  </div>
);

const AccessItem = ({ label, value, isLink }) => {
    if (!value) return null;
    return (
        <div className="mb-3">
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</span>
            {isLink ? (
                <a href={value} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline break-words block">
                    {value}
                </a>
            ) : (
                <p className="text-sm text-gray-700 leading-snug break-words">{value}</p>
            )}
        </div>
    );
};

// --- Main Component ---

const MetadataPage = () => {
  const {
        allFeedback, isFeedbackOpen, setIsFeedbackOpen,
        fallbackData, setFallbackData, handleSaveDraft, handleFinalSubmit
    } = useFeedback(viewQuestions);
  const data = studyData;
  const [expandedTables, setExpandedTables] = useState({});
  const [showEmailMenu, setShowEmailMenu] = useState(false);

  // --- Resizing State ---
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const isResizingRef = useRef(false);

  // --- Data Mapping & Processing (New Schema Handling) ---

  // 1. Description is now in documentation.description
  const descriptionText = data.documentation?.description || data.summary?.description || "";
  const documentationPreview = useMemo(() => getFirstTwoSentences(descriptionText), [descriptionText]);

  // 2. Keywords is now an array in summary.keywords
  const keywords = useMemo(() => normalizeList(data.summary.keywords), [data]);

  // 4. Structural Metadata is now inside an object with a 'tables' key
  const groupedMetadata = useMemo(() => {
    // Handle new schema (.tables) vs old schema (direct array)
    const tables = data.structuralMetadata?.tables || data.structuralMetadata || [];

    // In new schema, tables are already grouped objects, but let's normalize to ensure
    // the UI receives the expected structure: { EntityName: { description, columns } }
    return tables.reduce((acc, item) => {
      const entity = item.name;
      // In new schema, description is on the table object level
      const desc = item.description || "";

      // If we encounter the same table name twice (e.g. split across files), merge them
      if (!acc[entity]) {
        acc[entity] = { description: desc, columns: [] };
      }

      if (item.columns) {
        acc[entity].columns.push(...item.columns);
      }
      return acc;
    }, {});
  }, [data]);

  // 6. Accessors for Stat Cards (New Schema Paths)
  const population = data.summary.populationSize;
  const ageRange = data.coverage.typicalAgeRangeMin && data.coverage.typicalAgeRangeMax
    ? `${data.coverage.typicalAgeRangeMin} - ${data.coverage.typicalAgeRangeMax}`
    : data.coverage.typicalAgeRange; // Fallback to old string if present

  const leadTime = data.accessibility.access.deliveryLeadTime;
  const followUp = data.coverage.followUp;

  // For 'Files' stat, we use the Format from accessibility
  const fileTypes = data.accessibility.formatAndStandards?.format
    ? data.accessibility.formatAndStandards.format.map(f => f.split('/')[1] || f).join(', ')
    : "Various";
// --- NEW: Filter Processing Logic ---

  // A. Create lookup map from the reference file (Memoized)
  const filterLookupMap = useMemo(() => flattenFilterTree(filterData), []);

  // B. Process datasetFilters from studyData
// Replace the existing derivedFilters / activeIcons useMemo block
const { derivedFilters, activeIcons } = useMemo(() => {
    const filters = {};
    const icons = new Set();
    const targetIconKeys = Object.keys(ICON_MAPPING);


    const filterObjects = data.datasetFilters || [];

        filterObjects.forEach(filter => {
            // Use properties directly from the stored object
            const groupName = filter.primaryGroup || "Other Filters";
            const categoryName = filter.category || "Miscellaneous";

            if (!filters[groupName]) filters[groupName] = {};
            if (!filters[groupName][categoryName]) filters[groupName][categoryName] = [];

            filters[groupName][categoryName].push({
                label: filter.label,
                // You can still display description if available
                description: filter.description
            });

            // Icon Detection (using the stored label or category as the key)
            if (targetIconKeys.includes(filter.label)) {
                icons.add(filter.label);
            } else if (targetIconKeys.includes(filter.category)) {
                icons.add(filter.category);
            }
        });

        // Sort items alphabetically within each category
        Object.keys(filters).forEach(group => {
            Object.keys(filters[group]).forEach(cat => {
                filters[group][cat].sort((a, b) => a.label.localeCompare(b.label));
            });
        });

        const mappedIcons = Array.from(icons).map(key => ICON_MAPPING[key]);

        return { derivedFilters: filters, activeIcons: mappedIcons };
    }, [data]);

  // --- Resizing Handlers ---
  const startResizing = useCallback(() => {
    isResizingRef.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((mouseEvent) => {
    if (isResizingRef.current) {
        const newWidth = Math.max(200, Math.min(mouseEvent.clientX, 600));
        setSidebarWidth(newWidth);
    }
  }, []);

  // --- Other Handlers ---
  const downloadJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "mammogram_metadata.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleTable = (entityName) => {
    setExpandedTables(prev => ({ ...prev, [entityName]: !prev[entityName] }));
  };

  const toggleAllTables = (shouldExpand) => {
    const newState = {};
    Object.keys(groupedMetadata).forEach(key => { newState[key] = shouldExpand; });
    setExpandedTables(newState);
  };

  const handleEmailAction = (action) => {
    console.log(`User selected: ${action}`);
    setShowEmailMenu(false);
  };

  // Aliases for cleaner JSX below
  const { summary, accessibility, observations } = data;
  const access = accessibility.access || {};
  const usage = accessibility.usage || {};
  // Handle new resourceCreator being an array
  const resourceCreators = Array.isArray(usage.resourceCreator)
    ? usage.resourceCreator.join(', ')
    : (usage.resourceCreator?.name || usage.resourceCreator || "N/A");

  // Handle data use arrays (new schema) vs string (old schema)
  const dataUseLimit = Array.isArray(usage.dataUseLimitation) ? usage.dataUseLimitation.join(', ') : usage.dataUseLimitation;
  const dataUseReq = Array.isArray(usage.dataUseRequirements) ? usage.dataUseRequirements.join(', ') : usage.dataUseRequirement;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans text-gray-800">
        <FeedbackFallback
                data={fallbackData}
                onDismiss={() => setFallbackData(null)}
                onCopy={(text) => {
                    navigator.clipboard.writeText(text);
                    setFallbackData(null);
                }}
            />
        <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                activeSection="metadata_view" // Custom ID for this page
                allFeedback={allFeedback}
                onSaveDraft={handleSaveDraft}
                onFinalSubmit={handleFinalSubmit}
                questionData={viewQuestions}
            />
      {/* --- Left Navigation Panel --- */}
      <nav
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
        className="w-full md:w-[var(--sidebar-width)] bg-white shadow-md flex-shrink-0 p-6 md:h-screen md:sticky md:top-0 overflow-y-auto flex flex-col"
      >
        <h3 className="text-xl font-bold text-blue-900 mb-6 border-b pb-2">Overview</h3>
        <ul className="space-y-3 mb-8">
          {['Project','Summary', 'Documentation','Structural Metadata',  'Entity Relationship Diagrams', 'Observations'].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* --- Data Access Box --- */}
        <div className="mt-auto bg-blue-50 rounded-lg border border-blue-100 p-4">

            {/* Header with Email Icon */}
            <div className="flex justify-between items-center mb-4 border-b border-blue-200 pb-2 relative">
                <h4 className="font-bold text-blue-900">Data Access</h4>

                {/* Email Dropdown Container */}
                <div className="relative">
                    <button
                        onClick={() => setShowEmailMenu(!showEmailMenu)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-100"
                        title="Contact Options"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </button>

                    {showEmailMenu && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-200 z-50 overflow-hidden text-left">
                            <div className="py-1">
                                <button
                                    onClick={() => handleEmailAction('General Enquiry')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    Make a general enquiry
                                </button>
                                <button
                                    onClick={() => handleEmailAction('Feasibility Enquiry')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    Make a feasibility enquiry
                                </button>
                                <button
                                    onClick={() => handleEmailAction('Data Access Request')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-semibold"
                                >
                                    Start a data access request
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AccessItem label="Data Controller" value={access.dataController} />
            <AccessItem label="Data Processor" value={access.dataProcessor} />
            <AccessItem label="Access Rights" value={access.accessRights} isLink={true} />
            <AccessItem label="Delivery Lead Time" value={leadTime} />
            <AccessItem label="Data Use Requirement" value={dataUseReq} />
            <AccessItem label="Data Use Limitation" value={dataUseLimit} />
            <AccessItem
                label="Request Cost"
                value={access.accessRequestCost || "Information not available"}
            />
        </div>
      </nav>

      {/* --- Resizer Handle --- */}
      <div
        className="hidden md:block w-1 cursor-col-resize bg-gray-200 hover:bg-blue-400 hover:w-1.5 transition-all z-20 flex-shrink-0 active:bg-blue-600"
        onMouseDown={startResizing}
      ></div>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8 max-w-5xl mx-auto relative min-w-0">

        {/* Header Area */}
        <div className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-4xl font-extrabold text-blue-900 mb-3">{summary.title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 gap-2 sm:gap-6">
                    {/* Data Custodian / Publisher */}
                    <div className="flex items-center">
                        <span className="font-semibold mr-2">Publisher:</span>
                        {summary.dataCustodian?.name || summary.publisher?.name || "Unknown"}
                    </div>

                    {/* Funding (Might not exist in new schema, check safe access) */}
                    {summary.funding && (
                        <div className="flex items-center">
                            <span className="font-semibold mr-2">Funded By:</span>
                            <span>{summary.funding.name}</span>
                            {summary.funding['grant number'] && (
                                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded ml-2">
                                    {summary.funding['grant number']}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Download Button */}
            <button
                onClick={downloadJson}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded shadow transition flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download JSON
            </button>
        </div>

        {/* --- ICON GALLERY --- */}
        <div className="flex flex-wrap gap-6 mb-10 justify-center md:justify-start">
            {activeIcons.length > 0 ? (
                activeIcons.map((icon, idx) => (
                    <div key={idx} className="group relative w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center border border-gray-100 hover:border-blue-300 transition-all cursor-help">
                        <img src={icon.src} alt={icon.label} className="w-12 h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                            {icon.label}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-gray-400 italic text-sm">No specific data type icons found.</div>
            )}
        </div>

    {/* --- Stat Cards (Conditional Rendering) --- */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
      {population && (
        <StatCard
          label="Population"
          value={population.toLocaleString()}
          colorClass="bg-blue-50"
        />
      )}
      {ageRange && (
        <StatCard
          label="Age Range"
          value={ageRange}
          colorClass="bg-green-50"
        />
      )}
      {leadTime && (
        <StatCard
          label="Access"
          value={leadTime}
          colorClass="bg-purple-50"
        />
      )}
      {followUp && (
        <StatCard
          label="Follow Up"
          value={followUp}
          colorClass="bg-yellow-50"
        />
      )}
      {fileTypes && fileTypes !== "Various" && (
        <StatCard
          label="Formats"
          value={fileTypes}
          colorClass="bg-red-50"
        />
      )}
    </div>

    {/* Project */}
    <SectionHeading id="project" title="CRUK Project" />
    <div className="prose max-w-none text-gray-700 mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Project Name</span>
          <p className="text-lg font-semibold text-blue-900 m-0">{data.project.projectName}</p>
        </div>

        <div>
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Lead Researcher</span>
          <p className="text-base text-gray-800 m-0">
            {data.project.leadResearcher} — <span className="italic">{data.project.leadResearchInstitute}</span>
          </p>
        </div>

        <div>
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Timeline</span>
          <p className="text-sm text-gray-700 m-0">
            {data.project.projectStartDate} to {data.project.projectEndDate}
          </p>
        </div>

        <div>
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Grant Number(s)</span>
          <p className="text-sm font-mono text-gray-700 m-0">{data.project.grantNumbers}</p>
        </div>

        {/* This div now spans both columns on medium screens and larger */}
        <div className="md:col-span-2 border-t border-gray-100 pt-4">
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Project Scope</span>
          <p className="text-sm text-gray-700 m-0 leading-relaxed">
          </p>
            {data.project.projectScope}
        </div>

      </div>
    </div>



        {/* Summary */}
        <SectionHeading id="summary" title="Summary" />
        <div className="prose max-w-none text-gray-700 mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p>{summary.abstract}</p>
          {data.enrichmentAndLinkage?.syntheticDataWebLink && (
            <div className="mt-4">
              <span className="font-semibold">Associated Website: </span>
              {/* Handle Array or Single String for web link */}
              {Array.isArray(data.enrichmentAndLinkage.syntheticDataWebLink) ? (
                 data.enrichmentAndLinkage.syntheticDataWebLink.map((link, i) => (
                    <a key={i} href={link} className="text-blue-600 underline block">{link}</a>
                 ))
              ) : (
                 <a href={data.enrichmentAndLinkage.syntheticDataWebLink} className="text-blue-600 underline">
                    {data.enrichmentAndLinkage.syntheticDataWebLink}
                 </a>
              )}
            </div>
          )}
        </div>

        {/* Documentation */}
        <SectionHeading id="documentation" title="Documentation" />
        <details className="group bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <summary className="cursor-pointer p-6 bg-blue-50 hover:bg-blue-100 transition flex justify-between items-center list-none">
            <div>
              <h3 className="font-bold text-lg text-blue-900 mb-2">Detailed Description</h3>
              <p className="text-gray-700 italic">
                {documentationPreview}
                <span className="text-blue-600 ml-2 font-semibold not-italic text-sm">(Click to expand)</span>
              </p>
            </div>
            <span className="transform group-open:rotate-180 transition-transform duration-200 text-blue-500">▼</span>
          </summary>
          <div className="p-6 text-gray-700 leading-relaxed border-t border-gray-200 whitespace-pre-wrap">
            {descriptionText}
          </div>
        </details>

        {/* Structural Metadata */}
        <SectionHeading id="structural-metadata" title="Structural Metadata">
             <div className="space-x-2">
                <button onClick={() => toggleAllTables(true)} className="text-xs text-blue-600 hover:text-blue-800 font-medium underline">Expand All</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => toggleAllTables(false)} className="text-xs text-blue-600 hover:text-blue-800 font-medium underline">Collapse All</button>
             </div>
        </SectionHeading>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {Object.keys(groupedMetadata).length === 0 ? (
             <p className="p-4 text-gray-500">No structural metadata available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="p-3 border-b">Entity / Description</th>
                    <th className="p-3 border-b">Column Name</th>
                    <th className="p-3 border-b">Type</th>
                    <th className="p-3 border-b">Description</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {Object.entries(groupedMetadata).map(([entityName, data]) => {
                    const isExpanded = expandedTables[entityName];
                    return (
                        <React.Fragment key={entityName}>
                            <tr className="bg-blue-50 border-b border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => toggleTable(entityName)}>
                                <td colSpan="4" className="p-3">
                                    <div className="flex items-center">
                                        <span className={`transform transition-transform mr-2 text-blue-500 ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                                        <span className="font-bold text-blue-900 text-lg">{entityName}</span>
                                        {/* Handle description being short or long */}
                                        <span className="ml-4 text-gray-600 text-sm italic truncate max-w-md">{data.description}</span>
                                        <span className="ml-auto text-xs text-gray-400 font-medium">{data.columns.length} columns</span>
                                    </div>
                                </td>
                            </tr>
                            {isExpanded && data.columns.map((col, idx) => (
                                <tr key={`${entityName}-${col.name}-${idx}`} className="hover:bg-gray-50 border-b last:border-0 bg-white">
                                    <td className="p-3 w-1/5 border-r border-gray-50"></td>
                                    <td className="p-3 font-mono text-gray-700 w-1/4 font-semibold">{col.name}</td>
                                    <td className="p-3 text-gray-500 w-1/6">{col.dataType}</td>
                                    <td className="p-3 text-gray-600">{col.description}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ERD */}
        <div className="flex items-center justify-between mt-10 mb-4 border-b pb-2">
            <h2 id="entity-relationship-diagrams" className="text-2xl font-bold text-gray-800">Entity Relationship Diagrams</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-4 overflow-x-auto">
           <img src={erdImage} alt="Entity Relationship Diagram" className="min-w-full md:w-full h-auto object-contain" />
        </div>

        {/* Observations */}
        <SectionHeading id="observations" title="Observations" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {observations.map((obs, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
                    <div className="text-2xl font-bold text-gray-800 mb-1">{obs.measuredValue.toLocaleString()}</div>
                    <div className="text-sm font-semibold text-gray-600">{obs.observedNode}</div>
                    <div className="text-xs text-gray-400 mt-2">{obs.measuredProperty}</div>
                </div>
            ))}
        </div>

      </main>

      {/* --- Right Panel --- */}
      <aside className="w-full md:w-80 bg-white shadow-lg p-6 border-l border-gray-100 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">Filters & Tags</h3>

        {/* Keywords */}
        <div className="mb-6">
            <h4 className="font-semibold text-blue-900 mb-2 border-b border-gray-100 pb-1">Keywords</h4>
            <ul className="space-y-1">
                {keywords.map((kw, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                        {kw}
                    </li>
                ))}
            </ul>
        </div>
      {/* Filters */}
        <div className="space-y-6">
             {/* Resource Creator */}
             <div className="mb-4">
                 <h4 className="font-bold text-blue-900 mb-2 border-b border-gray-200 pb-1 text-base">Resource Creator</h4>
                 <p className="text-sm text-gray-600">{resourceCreators}</p>
             </div>

             {/* Dynamic Nested Filters */}
             {Object.entries(derivedFilters).map(([groupName, categories]) => (
                 <div key={groupName}>
                     {/* Main Group Header (e.g. Cancer Filters) */}
                     <h4 className="font-bold text-blue-900 mb-3 border-b border-gray-200 pb-1 text-base">{groupName}</h4>

                     {/* Loop through Sub-Categories (e.g. CRUK Terms, TCGA Terms) */}
                     {Object.entries(categories).map(([categoryName, items]) => (
                        <div key={categoryName} className="mb-4 pl-1">
                            {/* Sub-Category Header - Small & Uppercase */}
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{categoryName}</h5>

                            <ul className="pl-2 border-l-2 border-gray-100 ml-1">
                                {items.map((filter, idx) => (
                                    <li key={idx} className="mb-2 text-sm group/filter">
                                        <span className="text-gray-800 font-medium block">{filter.label}</span>
                                        {/* Replace filter.path with filter.description if you want to show it */}
                                        {filter.description && (
                                            <span className="text-xs text-gray-500 block break-words mt-0.5 italic">
                                                {filter.description}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                     ))}
                 </div>
             ))}

             {Object.keys(derivedFilters).length === 0 && (
                <p className="text-sm text-gray-400 italic">No dataset filters applied.</p>
             )}
        </div>
      </aside>
    {/* 3. The Feedback Button */}
            <button
                onClick={() => setIsFeedbackOpen(true)}
                className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 z-40 font-bold"
            >
                Feedback
            </button>
    </div>
  );
};

const meta = ReactDOM.createRoot(document.getElementById('meta'));
meta.render(<MetadataPage />);

export default MetadataPage;
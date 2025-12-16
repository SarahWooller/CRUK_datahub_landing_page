import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// 1. IMPORT DATA FROM UTILS
import mammogramData from '../utils/mammogram.json';

// 2. IMPORT ICONS
import animalIcon from '../assets/animal.png';
import backgroundIcon from '../assets/background.png';
import biobankIcon from '../assets/biobank.png';
import invitroIcon from '../assets/invitro.png';
import longitudinalIcon from '../assets/longitudinal.png';
import treatmentsIcon from '../assets/treatments.png';
import omicsIcon from '../assets/omics.png';
import imagingIcon from '../assets/medical_imaging.png';
import labResultsIcon from '../assets/lab_results.png';

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
  "Imaging Data": { src: imagingIcon, label: "Imaging Data" },
  "Biopsy Results and Lab Reports": { src: labResultsIcon, label: "Lab Results" }
};

// --- Utility Functions ---

const getFirstTwoSentences = (text) => {
  if (!text) return "";
  const match = text.match(/^.*?[.!?](?:\s|$)(?:.*?[.!?](?:\s|$))?/);
  return match ? match[0] : text;
};

const parseKeywords = (keywordString) => {
  if (!keywordString) return [];
  return keywordString.split(';,;').map(k => k.trim());
};

const getActiveIcons = (filters) => {
  const activeKeys = new Set();
  const targetKeys = Object.keys(ICON_MAPPING);

  const search = (obj) => {
    if (!obj) return;
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        if (typeof item === 'string' && targetKeys.includes(item)) {
          activeKeys.add(item);
        } else if (typeof item === 'object') {
          search(item);
        }
      });
      return;
    }
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (targetKeys.includes(key)) activeKeys.add(key);
        search(obj[key]);
      });
    }
  };

  search(filters);
  return Array.from(activeKeys).map(key => ICON_MAPPING[key]);
};

// --- Sub-Components ---

const StatCard = ({ label, value, colorClass }) => (
  <div className={`p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center ${colorClass}`}>
    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{label}</span>
    <span className="text-lg font-semibold text-gray-800">{value}</span>
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

// Helper for the Data Access sidebar items
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
  const data = mammogramData;
  const [expandedTables, setExpandedTables] = useState({});
  const [showEmailMenu, setShowEmailMenu] = useState(false);

  // --- Resizing State ---
  const [sidebarWidth, setSidebarWidth] = useState(288); // Default 288px (same as w-72)
  const isResizingRef = useRef(false);

  // --- Data Processing ---
  const activeIcons = useMemo(() => getActiveIcons(data.filters), [data]);
  const keywords = useMemo(() => parseKeywords(data.summary.keywords), [data]);
  const documentationPreview = useMemo(() => getFirstTwoSentences(data.summary.description), [data]);

  const groupedMetadata = useMemo(() => {
    if (!data.structuralMetadata) return {};
    return data.structuralMetadata.reduce((acc, item) => {
      const entity = item.name;
      if (!acc[entity]) {
        acc[entity] = { description: item.description, columns: [] };
      }
      if (item.columns) acc[entity].columns.push(...item.columns);
      return acc;
    }, {});
  }, [data]);

  // --- Resizing Handlers ---
  const startResizing = useCallback(() => {
    isResizingRef.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Prevent text selection while dragging
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
        // Limit width between 200px and 600px to prevent breaking layout
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

  const renderFilterTree = (obj) => {
    if (Array.isArray(obj)) {
      return (
        <ul className="pl-4 list-disc text-sm text-gray-600">
          {obj.map((item, idx) => (
            <li key={idx} className="mb-1">
                {typeof item === 'object' ? renderFilterTree(item) : item}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof obj === 'object' && obj !== null) {
      return (
        <ul className="pl-2">
          {Object.entries(obj).map(([key, value]) => (
            <li key={key} className="mb-2">
              <span className="font-semibold text-sm text-gray-700 block mb-1">{key}</span>
              {renderFilterTree(value)}
            </li>
          ))}
        </ul>
      );
    }
    return <span className="text-sm text-gray-600">{obj}</span>;
  };

  const handleEmailAction = (action) => {
    console.log(`User selected: ${action}`);
    setShowEmailMenu(false);
  };

  const { summary, coverage, accessibility, observations, filters } = data;
  const access = accessibility.access || {};
  const usage = accessibility.usage || {};

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans text-gray-800">

      {/* --- Left Navigation Panel --- */}
      {/* Note: We use a CSS variable for width so we can control it via state only on desktop (md:) */}
      <nav
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
        className="w-full md:w-[var(--sidebar-width)] bg-white shadow-md flex-shrink-0 p-6 md:h-screen md:sticky md:top-0 overflow-y-auto flex flex-col"
      >
        <h3 className="text-xl font-bold text-blue-900 mb-6 border-b pb-2">Overview</h3>
        <ul className="space-y-3 mb-8">
          {['Summary', 'Documentation','Structural Metadata',  'Entity Relationship Diagrams', 'Observations'].map((item) => (
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
            <AccessItem label="Delivery Lead Time" value={access.deliveryLeadTime} />
            <AccessItem label="Data Use Requirement" value={usage.dataUseRequirement} />
            <AccessItem label="Data Use Limitation" value={usage.dataUseLimitation} />
            <AccessItem
                label="Request Cost"
                value={access.accessRequestCost || "Information not available"}
            />
        </div>
      </nav>

      {/* --- Resizer Handle (Hidden on Mobile) --- */}
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
                    {/* Publisher */}
                    <div className="flex items-center">
                        <span className="font-semibold mr-2">Publisher:</span>
                        {summary.publisher.name}
                    </div>

                    {/* Funding */}
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

        {/* --- Stat Cards --- */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <StatCard label="Population" value={summary.populationSize?.toLocaleString()} colorClass="bg-blue-50" />
          <StatCard label="Age Range" value={coverage.typicalAgeRange} colorClass="bg-green-50" />
          <StatCard label="Access" value={access.deliveryLeadTime || "Restricted"} colorClass="bg-purple-50" />
          <StatCard label="Follow Up" value={coverage.followUp} colorClass="bg-yellow-50" />
          <StatCard label="Files" value={summary.datasetType} colorClass="bg-red-50" />
        </div>

        {/* Summary */}
        <SectionHeading id="summary" title="Summary" />
        <div className="prose max-w-none text-gray-700 mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p>{summary.abstract}</p>
          {summary.datasetLinkage?.syntheticDataWebLink && (
            <div className="mt-4">
              <span className="font-semibold">Associated Website: </span>
              <a href={summary.datasetLinkage.syntheticDataWebLink} className="text-blue-600 underline">
                {summary.datasetLinkage.syntheticDataWebLink}
              </a>
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
            {summary.description}
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
                                        <span className="ml-4 text-gray-600 text-sm italic">{data.description}</span>
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
        <div className="space-y-4">
             {Object.entries(filters).map(([category, contents]) => (
                 <div key={category}>
                     <h4 className="font-semibold text-blue-900 mb-2 border-b border-gray-100 pb-1">{category}</h4>
                     {renderFilterTree(contents)}
                 </div>
             ))}
        </div>
      </aside>

    </div>
  );
};

const meta = ReactDOM.createRoot(document.getElementById('meta'));
meta.render(<MetadataPage />);

export default MetadataPage;
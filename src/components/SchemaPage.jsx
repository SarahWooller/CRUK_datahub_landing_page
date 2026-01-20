import React, { useState, useCallback, useMemo } from 'react';
import schema from '../utils/schema.json';
import DataTagger, { FilterChipArea } from './DataTagger';
import JsonUpload from './JsonUpload';
import UploadTopBar from './UploadTopBar';
import { filterData } from '../utils/filter-setup';
import { deepMerge, isEmpty } from '../utils/mergeUtils';

// --- CONFIGURATION ---
const METADATA_PRIORITY_SECTIONS = ["version"];

const EXTRA_VALIDATIONS = {
    "datasetFilters": (value) => {
        if (!Array.isArray(value)) return false;
        const idPattern = /^(\d+_){0,5}\d+$/;
        return value.every(item => typeof item === 'string' && idPattern.test(item));
    }
};

// --- UTILITIES ---
const getValueByPath = (obj, path) => path.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);

const idExistsInBranch = (targetId, branch) => {
    if (!branch) return false;
    const items = Array.isArray(branch) ? branch : Object.values(branch);
    for (const item of items) {
        if (item.id === targetId) return true;
        if (item.children && idExistsInBranch(targetId, item.children)) return true;
    }
    return false;
};

// --- FORMATTING COMPONENTS ---
const MarkdownRenderer = ({ content }) => {
    if (!content) return null;
    const lineBlocks = content.split('\n');
    return (
        <div className="markdown-output space-y-2 text-sm text-gray-700">
            {lineBlocks.map((line, idx) => {
                if (!line.trim()) return <p key={idx} className="mb-0">&nbsp;</p>;
                const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
                return (
                    <p key={idx} className="mb-0">
                        {parts.map((part, pIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
                            if (part.startsWith('*') && part.endsWith('*')) return <em key={pIdx}>{part.slice(1, -1)}</em>;
                            if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
                                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                if (match) return <a key={pIdx} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{match[1]}</a>;
                            }
                            return <span key={pIdx}>{part}</span>;
                        })}
                    </p>
                );
            })}
        </div>
    );
};

const renderGuidance = (guidanceText) => {
    if (!guidanceText) return null;
    return guidanceText.split('\\n').map((line, idx) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <span key={idx} className="block mb-1">
                {parts.map((p, i) => p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>)}
            </span>
        );
    });
};

const StatusIcon = ({ status, isActive, isVisited }) => {
    if (isActive) return <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-blue-100 flex-shrink-0 shadow-sm"><div className="w-2 h-2 rounded-full bg-white"></div></div>;
    if (!isVisited && status !== 'complete') return <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300 flex-shrink-0"></div>;
    const colors = { complete: 'bg-green-500', partial: 'bg-amber-500', incomplete: 'bg-red-500' };
    return (
        <div className={`w-6 h-6 rounded-full ${colors[status] || 'bg-gray-200'} flex items-center justify-center shadow-sm flex-shrink-0`}>
            {status === 'complete' ? <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> :
             status === 'partial' ? <span className="text-white font-bold text-sm">!</span> :
             <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>}
        </div>
    );
};

// --- INPUT COMPONENTS ---
const FrequencyGrid = ({ value, onChange, enumOptions, label }) => {
    const currentData = Array.isArray(value) ? value : [];
    const handleCountChange = (bin, count) => {
        let newData = [...currentData];
        const idx = newData.findIndex(item => item.bin === bin);
        const val = count === '' ? null : parseInt(count, 10);
        if (idx > -1) {
            if (val === null || isNaN(val)) newData.splice(idx, 1);
            else newData[idx].count = val;
        } else if (val !== null && !isNaN(val)) newData.push({ bin, count: val });
        onChange(newData);
    };
    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{label} Breakdown</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-4xl">
                <div className="font-semibold text-gray-500 text-sm border-b pb-2 uppercase">Group</div>
                <div className="font-semibold text-gray-500 text-sm border-b pb-2 uppercase">Count</div>
                {enumOptions.map((bin) => (
                    <React.Fragment key={bin}>
                        <div className="flex items-center text-gray-700 text-sm font-medium">{bin}</div>
                        <input type="number" value={currentData.find(d => d.bin === bin)?.count || ''} onChange={(e) => handleCountChange(bin, e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500" />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const FieldRenderer = ({ propKey, prop, path, formData, onChange, isRequired, setActiveGuidance, resolveRef, dataSchema, level = 0 }) => {
    const [isMarkdownToggled, setIsMarkdownToggled] = useState(false);
    const resolve = useCallback((obj) => (obj && obj.$ref) ? resolveRef(obj.$ref) : obj, [resolveRef]);

    const { definition: fieldDef, enumValues, isArray } = useMemo(() => {
        let def = resolve(prop) || prop;
        if (def.allOf) { const ref = def.allOf.find(i => i.$ref); if (ref) def = resolve(ref) || def; }
        if (def.anyOf) {
            const nonNull = def.anyOf.filter(i => resolve(i)?.type !== 'null');
            const complex = nonNull.find(i => { const r = resolve(i); return r?.type === 'array' || r?.type === 'object'; });
            def = resolve(complex || nonNull[0]) || (complex || nonNull[0]);
        }
        return { definition: def, enumValues: def.enum || prop.enum, isArray: prop.type === 'array' || def.type === 'array' };
    }, [prop, resolve]);

    const currentValue = getValueByPath(formData, path);

    if (path.includes('demographicFrequency')) {
        if (propKey === 'age') return <FrequencyGrid value={currentValue} onChange={(v) => onChange(path, v)} enumOptions={dataSchema.$defs?.AgeEnum?.enum || []} label="Age" />;
        if (propKey === 'ethnicity') return <FrequencyGrid value={currentValue} onChange={(v) => onChange(path, v)} enumOptions={dataSchema.$defs?.EthnicityEnum?.enum || []} label="Ethnicity" />;
    }

    if (isArray) {
        const items = Array.isArray(currentValue) ? currentValue : [];
        return (
            <div className={`bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 ${level > 0 ? 'mt-4' : ''}`}>
                <label className="block text-lg font-bold text-gray-800 mb-2">{prop.title || propKey}</label>
                <p className="text-sm text-gray-600 mb-4">{prop.description}</p>
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="relative border-l-4 border-indigo-400 pl-4 py-4 bg-white rounded shadow-sm">
                            <button onClick={() => onChange(path, items.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-500 font-bold text-xs">Remove</button>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">{fieldDef.title ? `${fieldDef.title} #${idx + 1}` : `Item #${idx + 1}`}</h4>
                            {(() => {
                                let iDef = resolve(fieldDef.items || {});
                                if (!iDef.properties && iDef.anyOf) { const v = iDef.anyOf.find(i => resolve(i).type !== 'null'); if (v) iDef = resolve(v); }
                                if (iDef.properties) return Object.keys(iDef.properties).map(ck => <FieldRenderer key={ck} propKey={ck} prop={iDef.properties[ck]} path={[...path, idx, ck]} formData={formData} onChange={onChange} isRequired={iDef.required?.includes(ck)} setActiveGuidance={setActiveGuidance} resolveRef={resolveRef} dataSchema={dataSchema} level={level + 1} />);
                                return <input type="text" value={item || ''} onChange={(e) => { const n = [...items]; n[idx] = e.target.value; onChange(path, n); }} className="w-full p-2 border rounded" />;
                            })()}
                        </div>
                    ))}
                </div>
                <button onClick={() => onChange(path, [...items, {}])} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded text-sm">+ Add Item</button>
            </div>
        );
    }

    let inputType = 'text', rows = 1;
    if (prop.contentMediaType?.startsWith('image/')) inputType = 'file';
    else if (prop.showMarkdown === "True" || (prop.title && (prop.title.includes("Description") || prop.title.includes("Abstract")))) { inputType = 'textarea'; rows = 4; }
    else if (fieldDef.type === 'integer' || fieldDef.type === 'number') inputType = 'number';
    else if (fieldDef.type === 'boolean') inputType = 'checkbox';
    else if (enumValues) inputType = 'select-single';

    const handleFocus = () => setActiveGuidance({ title: prop.title || propKey, guidance: prop.guidance || prop.description || 'No guidance provided.' });
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => onChange(path, reader.result);
            reader.readAsDataURL(file);
        } else if (file) alert("File size exceeds 5MB.");
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">{prop.title || propKey} {isRequired && <span className="text-red-500">*</span>}</label>
            <p className="text-xs text-gray-500 mb-2">{prop.description}</p>
            {inputType === 'file' && currentValue && (
                <div className="mb-2 p-2 border rounded bg-gray-50"><img src={currentValue} className="max-w-full max-h-64 rounded" alt="Preview" /><button onClick={() => onChange(path, null)} className="text-xs text-red-600 underline mt-2 block">Remove Image</button></div>
            )}
            {inputType === 'textarea' && prop.showMarkdown === "True" && (
                <div className="flex justify-end mb-1"><button onClick={() => setIsMarkdownToggled(!isMarkdownToggled)} className="text-xs px-2 py-1 bg-gray-100 rounded">{isMarkdownToggled ? 'Edit' : 'Preview'}</button></div>
            )}
            {isMarkdownToggled ? (
                <div className="p-3 border rounded bg-indigo-50"><MarkdownRenderer content={currentValue || ''} /></div>
            ) : inputType === 'select-single' ? (
                <select className="w-full p-2 border rounded" onFocus={handleFocus} value={currentValue || ''} onChange={(e) => onChange(path, e.target.value)}><option value="">-- Select --</option>{enumValues.map(o => <option key={o} value={o}>{o}</option>)}</select>
            ) : inputType === 'textarea' ? (
                <textarea className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" rows={rows} onFocus={handleFocus} value={currentValue || ''} onChange={(e) => onChange(path, e.target.value)} placeholder={prop.examples?.join(', ')} />
            ) : inputType === 'checkbox' ? (
                <div className="flex items-center"><button onClick={() => { onChange(path, !currentValue); handleFocus(); }} className={`${currentValue ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 rounded-full`} role="switch"><span className={`${currentValue ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 transform rounded-full bg-white transition`} /></button><span className="ml-3 text-sm text-gray-700">{currentValue ? 'Yes' : 'No'}</span></div>
            ) : inputType === 'file' ? (
                <input type="file" accept="image/*" className="w-full p-2 border rounded" onFocus={handleFocus} onChange={handleFile} />
            ) : (
                <input type={inputType} className="w-full p-2 border rounded" onFocus={handleFocus} value={currentValue || ''} onChange={(e) => onChange(path, inputType === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)} placeholder={prop.examples?.join(', ')} />
            )}
        </div>
    );
};

// --- FORM LOGIC ---
const SchemaForm = ({ sectionKey, formData, onFormChange, setActiveGuidance, onUpload, welcomeType, dataSchema, resolveRef }) => {
    const sectionSchema = dataSchema.properties[sectionKey] || {};

    if (sectionKey === 'welcome') {
        return (
            <div className="p-8 w-full overflow-y-auto pb-20">
                <h1 className="text-3xl font-extrabold mb-4 text-gray-900">{sectionSchema.title || "Welcome"}</h1>
                {/* BUG FIX: Changed <p> to <div> to allow block-level descendants like JsonUpload */}
                <div className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {sectionSchema.description}
                    <div className="mt-4">
                        <JsonUpload schema={dataSchema} onUpload={onUpload} additionalValidations={EXTRA_VALIDATIONS} />
                    </div>
                </div>
                <div className={`p-4 rounded-lg mb-6 ${welcomeType === 'new' ? 'bg-indigo-50 border-indigo-200' : 'bg-blue-50 border-blue-200'} border`}>
                    <p className="text-sm text-gray-700 font-bold">{welcomeType === 'new' ? "Note: You are in New Project mode. Technical dataset sections are hidden." : "Upload existing metadata to resume."}</p>
                </div>
            </div>
        );
    }

    if (sectionKey === 'datasetFilters') {
        return (
            <div className="w-2/4 p-8 overflow-y-auto pb-20">
                <h1 className="text-3xl font-extrabold mb-4 text-gray-800">Dataset Filters</h1>
                <DataTagger value={formData['datasetFilters'] || []} onChange={(tags) => onFormChange(['datasetFilters'], tags)} />
            </div>
        );
    }

    const resolve = (s) => {
        let ref = s.$ref || s.allOf?.find(i => i.$ref)?.$ref;
        if (!ref && s.anyOf) { const valid = s.anyOf.find(i => i.type !== 'null'); if (valid) ref = valid.$ref; }
        return ref ? resolveRef(ref) : s;
    };

    const def = resolve(sectionSchema);
    // Restoration: Check if it is an object/container
    const isContainer = def && (def.type === 'object' || def.properties);
    const props = def.properties || {};

    return (
        <div className="w-2/4 p-8 overflow-y-auto pb-20">
            <h1 className="text-3xl font-extrabold mb-2">{sectionSchema.title || sectionKey}</h1>
            <p className="text-gray-600 mb-8 border-b pb-4">{sectionSchema.description}</p>
            {sectionKey === 'erd' && (
                <div className="mb-8 p-4 bg-gray-50 border rounded-lg"><p className="text-sm font-bold mb-2">Example ERD:</p><img src='../assets/erd.png' alt="Example ERD" className="max-w-full h-auto border shadow-sm" /></div>
            )}

            {/* Restoration: Conditional render for simple vs complex fields */}
            {isContainer ? (
                <div className="space-y-6">
                    {Object.keys(props).map(pk => (
                        <FieldRenderer key={pk} propKey={pk} prop={props[pk]} path={[sectionKey, pk]} formData={formData} onChange={onFormChange} isRequired={def.required?.includes(pk)} setActiveGuidance={setActiveGuidance} resolveRef={resolveRef} dataSchema={dataSchema} />
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                     <FieldRenderer
                        propKey={sectionKey}
                        prop={METADATA_PRIORITY_SECTIONS.includes(sectionKey) ? sectionSchema : (def || sectionSchema)}
                        path={[sectionKey]}
                        formData={formData}
                        onChange={onFormChange}
                        isRequired={dataSchema.required?.includes(sectionKey)}
                        setActiveGuidance={setActiveGuidance}
                        resolveRef={resolveRef}
                        dataSchema={dataSchema}
                    />
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE ---
const SchemaPage = ({ visibleSections = [], semanticOverlay = {}, welcomeType = 'standard' }) => {
    const DATA_SCHEMA = useMemo(() => deepMerge(schema.properties ? schema : (schema.fullContent || {}), semanticOverlay), [semanticOverlay]);

    const resolveRef = useCallback((ref) => {
        if (!ref || !ref.startsWith('#/$defs/')) return null;
        const key = ref.split('/').pop();
        return DATA_SCHEMA.$defs ? DATA_SCHEMA.$defs[key] : null;
    }, [DATA_SCHEMA]);

    const calculateSectionStatus = useCallback((key, fData) => {
        if (key === 'welcome') return 'info';
        if (key === 'datasetFilters') {
            const tags = fData[key] || [];
            if (tags.length === 0) return 'incomplete';
            const b = [filterData['0_0']?.children?.['0_0_0']?.children, filterData['0_0']?.children?.['0_0_1']?.children, filterData['0_2']?.children, filterData['0_1']?.children];
            return b.every(branch => tags.some(id => idExistsInBranch(id, branch))) ? 'complete' : 'incomplete';
        }
        const data = fData[key];
        if (isEmpty(data)) return DATA_SCHEMA.required?.includes(key) ? 'incomplete' : 'partial';
        return 'complete';
    }, [DATA_SCHEMA]);

    const [formData, setFormData] = useState({});
    const [activeSection, setActiveSection] = useState(visibleSections[0] || 'welcome');
    const [activeGuidance, setActiveGuidance] = useState(null);
    const [visitedSections, setVisitedSections] = useState(new Set([activeSection]));

    const handleNavChange = (key) => { setVisitedSections(p => new Set(p).add(key)); setActiveSection(key); setActiveGuidance(null); };

    const handleDataChange = useCallback((path, val) => {
        setFormData(prev => {
            const newData = { ...prev };
            let curr = newData;
            for (let i = 0; i < path.length - 1; i++) {
                const k = path[i], nK = path[i + 1];
                if (curr[k] === undefined) curr[k] = typeof nK === 'number' ? [] : {};
                curr[k] = Array.isArray(curr[k]) ? [...curr[k]] : { ...curr[k] };
                curr = curr[k];
            }
            curr[path[path.length - 1]] = val;
            return newData;
        });
    }, []);

    const preprocessData = (data) => {
        if (!data || typeof data !== 'object') return data;
        const newData = JSON.parse(JSON.stringify(data));
        if (Array.isArray(newData.structuralMetadata)) newData.structuralMetadata = { tables: newData.structuralMetadata };
        if (newData.structuralMetadata?.tables) {
            const tableMap = new Map();
            newData.structuralMetadata.tables.forEach(t => {
                if (tableMap.has(t.name)) tableMap.get(t.name).columns = [...(tableMap.get(t.name).columns || []), ...(t.columns || [])];
                else tableMap.set(t.name, t);
            });
            newData.structuralMetadata.tables = Array.from(tableMap.values());
        }
        return newData;
    };

    const handleJsonUpload = (data) => {
        const clean = preprocessData(data);
        setFormData(clean);
        setVisitedSections(new Set([...Object.keys(DATA_SCHEMA.properties), 'datasetFilters', 'welcome']));
    };

    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "dataset_metadata.json";
        link.click();
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <UploadTopBar formData={formData} schema={DATA_SCHEMA} />
            <div className="flex flex-grow overflow-hidden h-[calc(100vh-40px)]">
                {/* Fixed BUG: Corrected dataSchema to local variable DATA_SCHEMA */}
                <div className="w-1/5 bg-gray-50 border-r overflow-y-auto p-6">
                    <h2 className="text-lg font-bold mb-4 text-gray-700">Metadata Sections</h2>
                    <ul className="space-y-2">
                        {visibleSections.map(sk => {
                            const prop = DATA_SCHEMA.properties[sk];
                            return (
                                <li key={sk}>
                                    <button onClick={() => handleNavChange(sk)} className={`w-full text-left p-3 rounded-md transition-colors text-sm flex items-center justify-between ${activeSection === sk ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`}>
                                        <span>{prop?.title || sk.charAt(0).toUpperCase() + sk.slice(1)}</span>
                                        {visitedSections.has(sk) && sk !== 'welcome' && <StatusIcon status={calculateSectionStatus(sk, formData)} isActive={activeSection === sk} isVisited={true} />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="w-4/5 flex h-full">
                    <SchemaForm sectionKey={activeSection} formData={formData} onFormChange={handleDataChange} setActiveGuidance={setActiveGuidance} onUpload={handleJsonUpload} welcomeType={welcomeType} dataSchema={DATA_SCHEMA} resolveRef={resolveRef} />
                    {activeSection !== 'welcome' && (
                        <div className="w-1/4 border-l p-6 bg-gray-50 overflow-y-auto h-full">
                            <h2 className="text-lg font-bold mb-4 text-gray-700">Field Guidance</h2>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                {activeGuidance ? <><h3 className="text-md font-bold text-indigo-700 mb-3 border-b pb-2">{activeGuidance.title}</h3><div className="text-sm text-gray-600 leading-relaxed">{renderGuidance(activeGuidance.guidance)}</div></> : <div className="text-center py-10 text-gray-400">Select a field.</div>}
                            </div>
                            {activeSection === 'datasetFilters' && (
                                <div className="mt-6"><h2 className="text-lg font-bold mb-4 text-gray-700">Active Tags</h2><div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 min-h-[200px]"><FilterChipArea selectedFilters={formData['datasetFilters'] || []} handleFilterChange={(id) => handleDataChange(['datasetFilters'], (formData['datasetFilters'] || []).filter(t => t !== id))} /></div></div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchemaPage;
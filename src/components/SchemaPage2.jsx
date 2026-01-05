import React, { useState, useCallback } from 'react';
// Ensure this points to your FULL schema file
import schema from '../utils/schema.json';

// --- Safe Schema Loading ---
const DATA_SCHEMA = schema.properties ? schema : (schema.fullContent || {});

// --- Utility: Resolve References ---
const resolveRef = (ref) => {
    if (!ref || typeof ref !== 'string' || !ref.startsWith('#/$defs/')) {
        return null;
    }
    const defKey = ref.split('/').pop();
    return DATA_SCHEMA.$defs ? DATA_SCHEMA.$defs[defKey] : null;
};

// --- Utility: Get Safe Value ---
const getValueByPath = (obj, path) => {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
};

// --- Utility: Render Guidance ---
const renderGuidance = (guidanceText) => {
    if (!guidanceText) return null;
    return guidanceText.split('\\n').map((line, lineIndex) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <span key={lineIndex} className="block mb-1">
                {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                    }
                    return <span key={partIndex}>{part}</span>;
                })}
            </span>
        );
    });
};

// --- Component: Markdown Renderer ---
const MarkdownRenderer = ({ content }) => {
    if (!content) return null;
    const lineBlocks = content.split('\n');
    return (
        <div className="markdown-output space-y-2 text-sm text-gray-700">
            {lineBlocks.map((line, lineIndex) => {
                if (!line.trim()) return <p key={lineIndex} className="mb-0">&nbsp;</p>;
                const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
                return (
                    <p key={lineIndex} className="mb-0">
                        {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                            } else if (part.startsWith('*') && part.endsWith('*')) {
                                return <em key={partIndex}>{part.slice(1, -1)}</em>;
                            } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
                                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                if (match && match.length === 3) {
                                    const [_, text, url] = match;
                                    return <a key={partIndex} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{text}</a>;
                                }
                            }
                            return <span key={partIndex}>{part}</span>;
                        })}
                    </p>
                );
            })}
        </div>
    );
};

// --- Component: Field Renderer (Recursive) ---
// --- Component: Field Renderer (Recursive) ---
const FieldRenderer = ({
    propKey,
    prop,
    path,
    formData,
    onChange,
    isRequired,
    setActiveGuidance,
    level = 0
}) => {
    const [isMarkdownToggled, setIsMarkdownToggled] = useState(false);

    // FIX: Updated logic to handle inline definitions inside anyOf
    const getDefinitionAndEnum = (p) => {
        let definition = p;

        // Helper: resolves a ref if it exists, otherwise returns the object itself
        const resolve = (obj) => (obj && obj.$ref ? resolveRef(obj.$ref) : obj);

        // 1. Direct Ref
        if (p.$ref) {
            definition = resolveRef(p.$ref) || p;
        }
        // 2. allOf: grab the first ref found
        else if (p.allOf) {
            const refItem = p.allOf.find(i => i.$ref);
            if (refItem) definition = resolveRef(refItem.$ref);
        }
        // 3. anyOf: Find the option that is NOT null
        else if (p.anyOf) {
            const validOption = p.anyOf.find(i => i.type !== 'null');
            if (validOption) {
                // If the valid option is a ref, resolve it.
                // If it's an inline definition (like type: 'array'), use it directly.
                definition = resolve(validOption);
            }
        }

        // 4. Array Items Ref check (just to ensure we have the full definition if it's an array)
        if (definition.type === 'array' && definition.items && definition.items.$ref) {
             // no-op, we just confirmed it's an array
        }

        const enumValues = definition.enum || p.enum;
        // Check both the original prop (p) AND the resolved definition for 'array' type
        const isArray = p.type === 'array' || definition.type === 'array';

        return { definition, enumValues, isArray };
    };

    const { definition: fieldDef, enumValues, isArray } = getDefinitionAndEnum(prop);
    const currentValue = getValueByPath(formData, path);

    // -- Handle Array Rendering --
    if (isArray) {
        const items = Array.isArray(currentValue) ? currentValue : [];

        const handleAdd = () => {
            // Logic to determine if the new item is an Object (DataTable) or Primitive (String)
            let itemSchema = fieldDef.items || {};

            // Resolve the item schema (it might be a ref, or inside anyOf)
            let resolvedItemDef = itemSchema;
            if (itemSchema.$ref) {
                resolvedItemDef = resolveRef(itemSchema.$ref);
            } else if (itemSchema.anyOf) {
                 const validItem = itemSchema.anyOf.find(i => i.$ref && i.type !== 'null');
                 if (validItem) resolvedItemDef = resolveRef(validItem.$ref);
            }

            // If the resolved item has properties, it's an object. Otherwise treat as primitive string.
            const newItem = (resolvedItemDef && (resolvedItemDef.type === 'object' || resolvedItemDef.properties)) ? {} : '';

            const newArray = [...items, newItem];
            onChange(path, newArray);
        };

        const handleRemove = (index) => {
            const newArray = items.filter((_, i) => i !== index);
            onChange(path, newArray);
        };

        return (
            <div className={`bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 ${level > 0 ? 'mt-4' : ''}`}>
                <label className="block text-lg font-bold text-gray-800 mb-2">{prop.title || propKey}</label>
                <p className="text-sm text-gray-600 mb-4">{prop.description}</p>

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="relative border-l-4 border-indigo-400 pl-4 py-2 bg-white rounded shadow-sm">
                            <button
                                onClick={() => handleRemove(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 border border-red-200 rounded z-10"
                            >
                                Remove
                            </button>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {fieldDef.title || 'Item'} #{index + 1}
                            </h4>

                            {/* Recursion Logic for Items */}
                            {(() => {
                                let itemSchema = fieldDef.items || {};
                                let resolvedItemDef = itemSchema;

                                // Resolve Ref deep dive for the Item
                                if (itemSchema.$ref) {
                                    resolvedItemDef = resolveRef(itemSchema.$ref);
                                } else if (itemSchema.anyOf) {
                                     const refOption = itemSchema.anyOf.find(i => i.$ref);
                                     if(refOption) resolvedItemDef = resolveRef(refOption.$ref);
                                }

                                if (resolvedItemDef && resolvedItemDef.properties) {
                                    // Complex Object Render
                                    return Object.keys(resolvedItemDef.properties).map(childKey => (
                                        <FieldRenderer
                                            key={childKey}
                                            propKey={childKey}
                                            prop={resolvedItemDef.properties[childKey]}
                                            path={[...path, index, childKey]}
                                            formData={formData}
                                            onChange={onChange}
                                            isRequired={resolvedItemDef.required?.includes(childKey)}
                                            setActiveGuidance={setActiveGuidance}
                                            level={level + 1}
                                        />
                                    ));
                                } else {
                                    // Primitive Render
                                    return (
                                        <input
                                            type="text"
                                            value={item || ''}
                                            onChange={(e) => {
                                                const newArr = [...items];
                                                newArr[index] = e.target.value;
                                                onChange(path, newArr);
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    );
                                }
                            })()}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAdd}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition"
                >
                    + Add {prop.title || 'Item'}
                </button>
            </div>
        );
    }

    // -- Determine Input Type for Non-Arrays --
    let inputType = 'text';
    let rows = 1;
    const examples = prop.examples;
    let placeholder = examples && examples.length > 0 ? examples.join(', ') : 'Enter value...';
    const showMarkdownToggle = prop.showMarkdown === "True";

    if (showMarkdownToggle || (fieldDef.title && (fieldDef.title.includes("Description") || fieldDef.title.includes("Guidance") || fieldDef.title.includes("Abstract")))) {
        inputType = 'textarea';
        rows = 4;
    } else if (prop.type === 'integer' || fieldDef.type === 'integer') {
        inputType = 'number';
    } else if (prop.type === 'boolean' || fieldDef.type === 'boolean') {
        inputType = 'checkbox';
    }

    const handleFocus = () => {
        const guidance = prop.guidance || prop.description || 'No specific guidance provided.';
        setActiveGuidance({ title: prop.title || propKey, guidance });
    };

    const handleChange = (e) => {
        let val = e.target.value;
        if (inputType === 'checkbox') val = e.target.checked;
        if (inputType === 'number') val = e.target.value === '' ? null : Number(e.target.value);
        onChange(path, val);
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 ${level > 0 ? 'ml-0' : ''}`}>
            <label className="block text-sm font-bold text-gray-700 mb-1">
                {prop.title || propKey} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <p className="text-xs text-gray-500 mb-2">{prop.description}</p>

            {showMarkdownToggle && inputType === 'textarea' && (
                <div className="flex justify-end mb-1">
                    <button
                        onClick={() => setIsMarkdownToggled(prev => !prev)}
                        className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                        {isMarkdownToggled ? 'Edit' : 'Preview Markdown'}
                    </button>
                </div>
            )}

            {inputType === 'textarea' && isMarkdownToggled ? (
                <div className="p-3 border border-indigo-200 rounded-md bg-indigo-50 min-h-[5rem]">
                    <MarkdownRenderer content={currentValue || ''} />
                </div>
            ) : inputType === 'select-single' && enumValues ? (
                <select
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    onFocus={handleFocus}
                    value={currentValue || ''}
                    onChange={handleChange}
                >
                    <option value="">-- Select --</option>
                    {enumValues.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : inputType === 'textarea' ? (
                <textarea
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={placeholder}
                    rows={rows}
                    onFocus={handleFocus}
                    value={currentValue || ''}
                    onChange={handleChange}
                />
            ) : inputType === 'checkbox' ? (
                 <div className="flex items-center">
                    <input
                        type="checkbox"
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={!!currentValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                    />
                    <span className="ml-2 text-sm text-gray-600">{currentValue ? 'Yes' : 'No'}</span>
                 </div>
            ) : (
                <input
                    type={inputType}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    value={currentValue || ''}
                    onChange={handleChange}
                />
            )}
        </div>
    );
};

// --- Component: Main Form Logic ---
const SchemaForm = ({ sectionKey, formData, onFormChange, setActiveGuidance }) => {
    const sectionSchema = DATA_SCHEMA.properties ? DATA_SCHEMA.properties[sectionKey] : null;

    if (!sectionSchema) return <p className="p-8">Section not found or Schema is invalid.</p>;

    // RECURSIVE RESOLVER: Unwraps allOf AND anyOf to find the real object definition
    const resolveDefinition = (s) => {
        if (!s) return null;
        let ref = s.$ref;
        if (!ref) ref = s.allOf?.find(i => i.$ref)?.$ref;
        // The Fix: Unwrap anyOf correctly (filtering out null types)
        if (!ref) ref = s.anyOf?.find(i => i.$ref && i.type !== 'null')?.$ref;

        if (ref) {
            return resolveRef(ref);
        }
        return s; // Return original if no ref found
    };

    const definition = resolveDefinition(sectionSchema);

    // FIX: Check if definition exists and has properties to determine if it's a container
    const isContainer = definition && (definition.type === 'object' || definition.properties);

    return (
        <div className="w-2/4 p-8 overflow-y-auto pb-20">
            <h1 className="text-3xl font-extrabold mb-2 text-gray-800">
                {sectionSchema.title || sectionKey}
            </h1>
            <p className="text-gray-600 mb-8 border-b pb-4">{sectionSchema.description}</p>

            {isContainer ? (
                <div className="space-y-6">
                    {Object.keys(definition.properties).map((propKey) => {
                        return (
                            <FieldRenderer
                                key={propKey}
                                propKey={propKey}
                                prop={definition.properties[propKey]}
                                path={[sectionKey, propKey]}
                                formData={formData}
                                onChange={onFormChange}
                                isRequired={definition.required?.includes(propKey)}
                                setActiveGuidance={setActiveGuidance}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-6">
                     <FieldRenderer
                        propKey={sectionKey}
                        prop={definition || sectionSchema}
                        path={[sectionKey]}
                        formData={formData}
                        onChange={onFormChange}
                        isRequired={DATA_SCHEMA.required?.includes(sectionKey)}
                        setActiveGuidance={setActiveGuidance}
                    />
                </div>
            )}
        </div>
    );
};

// --- Component: Navigation & Download ---
const SchemaNav = ({ activeSection, setActiveSection, onDownload }) => {
    const sections = DATA_SCHEMA.properties ? Object.keys(DATA_SCHEMA.properties) : [];

    return (
        <div className="w-1/5 border-r border-gray-200 bg-gray-50 h-screen flex flex-col">
            <div className="p-6 overflow-y-auto flex-grow">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Metadata Sections</h2>
                <ul className="space-y-2">
                    {sections.map((sectionKey) => (
                        <li key={sectionKey}>
                            <button
                                onClick={() => setActiveSection(sectionKey)}
                                className={`w-full text-left p-3 rounded-md transition-colors duration-150 text-sm font-medium ${
                                    activeSection === sectionKey
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-indigo-100'
                                }`}
                            >
                                {DATA_SCHEMA.properties[sectionKey]?.title || sectionKey}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-6 border-t border-gray-200 bg-white">
                <button
                    onClick={onDownload}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download JSON
                </button>
            </div>
        </div>
    );
};

// --- Component: Guidance Panel ---
const GuidancePanel = ({ activeGuidance }) => (
    <div className="w-1/4 border-l border-gray-200 p-6 bg-gray-50 h-screen sticky top-0 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Field Guidance</h2>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            {activeGuidance ? (
                <>
                    <h3 className="text-md font-bold text-indigo-700 mb-3 border-b pb-2">{activeGuidance.title}</h3>
                    <div className="text-sm text-gray-600 leading-relaxed">
                        {renderGuidance(activeGuidance.guidance)}
                    </div>
                </>
            ) : (
                <div className="text-center py-10 text-gray-400">
                    <p>Select a field to view help.</p>
                </div>
            )}
        </div>
    </div>
);

// --- Main Application ---
const SchemaPage = () => {
    // Safety Check on Initialization
    if (!DATA_SCHEMA || !DATA_SCHEMA.properties) {
        return (
            <div className="p-10 text-red-600 font-bold">
                Error: Schema file is invalid or missing 'properties'. Check console or schema file structure.
            </div>
        );
    }

    const [formData, setFormData] = useState({});
    const [activeSection, setActiveSection] = useState(Object.keys(DATA_SCHEMA.properties)[0]);
    const [activeGuidance, setActiveGuidance] = useState(null);

    const handleDataChange = useCallback((path, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            let current = newData;

            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (current[key] === undefined) {
                    current[key] = typeof path[i+1] === 'number' ? [] : {};
                }

                if (Array.isArray(current[key])) {
                     current[key] = [...current[key]];
                } else {
                     current[key] = { ...current[key] };
                }

                current = current[key];
            }

            current[path[path.length - 1]] = value;
            return newData;
        });
    }, []);

    const downloadJSON = () => {
        const fileData = JSON.stringify(formData, null, 2);
        const blob = new Blob([fileData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "dataset_metadata.json";
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex min-h-screen font-sans bg-white">
            <SchemaNav
                activeSection={activeSection}
                setActiveSection={(key) => { setActiveSection(key); setActiveGuidance(null); }}
                onDownload={downloadJSON}
            />

            <SchemaForm
                sectionKey={activeSection}
                formData={formData}
                onFormChange={handleDataChange}
                setActiveGuidance={setActiveGuidance}
            />

            <GuidancePanel
                activeGuidance={activeGuidance}
            />
        </div>
    );
};

export default SchemaPage;
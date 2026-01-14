import React, { useState, useCallback, useMemo } from 'react';
import schema from '../utils/schema.json';
import semanticSchema from '../utils/semanticSchema.json';
import DataTagger, { FilterChipArea } from './DataTagger';
import JsonUpload from './JsonUpload';
import UploadTopBar from './UploadTopBar';
import { filterData } from '../utils/filter-setup';

// --- CONFIGURATION: Priority Sections ---
// Sections in this list will prioritize the property's own metadata (Title, Description, Guidance)
// over the metadata found in the resolved definition ($ref/allOf).
const METADATA_PRIORITY_SECTIONS = [
    "version"
];

// --- USER CONFIGURATION: Sidebar Section Order & Visibility ---
const VISIBLE_SECTIONS = [
    "welcome",
    "version",
    "summary",
    "documentation",
    "datasetFilters",
    "structuralMetadata",
    "erd", // Preserved ERD section
    "coverage",
    "provenance",
    "accessibility",
    "access",
    "enrichmentAndLinkage",
    "observations",
    "demographicFrequency",
    "omics"
];
// --- Utility: Deep Merge Schemas ---
const deepMerge = (target, source) => {
    // If either is not an object, return the source (override) or target
    if (typeof target !== 'object' || target === null) return source || target;
    if (typeof source !== 'object' || source === null) return target;

    // Clone target to avoid mutation
    const output = Array.isArray(target) ? [...target] : { ...target };

    Object.keys(source).forEach(key => {
        const targetValue = output[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            // DECISION: For arrays, do we overwrite or concatenate?
            // For a "semantic override" (like replacing a list of enums or requirements),
            // usually overwriting is safer. If you just want to change text,
            // you generally won't be touching arrays in the semantic schema.
            output[key] = sourceValue;
        } else if (typeof targetValue === 'object' && typeof sourceValue === 'object') {
            output[key] = deepMerge(targetValue, sourceValue);
        } else {
            output[key] = sourceValue;
        }
    });

    return output;
};
// --- Safe Schema Loading and Merging ---
const RAW_SCHEMA = schema.properties ? schema : (schema.fullContent || {});
const OVERLAY_SCHEMA = semanticSchema.properties ? semanticSchema : (semanticSchema.fullContent || semanticSchema);

// This creates a new object where semanticSchema properties overwrite rawSchema properties
const DATA_SCHEMA = deepMerge(RAW_SCHEMA, OVERLAY_SCHEMA);

// --- CUSTOM VALIDATION RULES ---
const EXTRA_VALIDATIONS = {
    "datasetFilters": (value) => {
        if (!Array.isArray(value)) return false;
        const idPattern = /^(\d+_){0,5}\d+$/;
        return value.every(item => typeof item === 'string' && idPattern.test(item));
    }
};

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

// --- Utility: Check emptiness ---
const isEmpty = (value) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
};

// --- Utility: Hierarchy Helper ---
const idExistsInBranch = (targetId, branch) => {
    if (!branch) return false;
    const items = Array.isArray(branch) ? branch : Object.values(branch);

    for (const item of items) {
        if (item.id === targetId) return true;
        if (item.children && idExistsInBranch(targetId, item.children)) return true;
    }
    return false;
};

// --- Utility: Calculate Section Status ---
const calculateSectionStatus = (sectionKey, formData) => {
    // 1. Special Case: Dataset Filters
    if (sectionKey === 'datasetFilters') {
        const tags = formData['datasetFilters'] || [];
        if (tags.length === 0) return 'incomplete';

        const topographyBranch = filterData['0_0']?.children?.['0_0_0']?.children;
        const histologyBranch  = filterData['0_0']?.children?.['0_0_1']?.children;
        const dataTypeBranch   = filterData['0_2']?.children;
        const accessBranch     = filterData['0_1']?.children;

        let hasTopo = false;
        let hasHisto = false;
        let hasData = false;
        let hasAccess = false;

        tags.forEach(id => {
            if (!hasTopo && idExistsInBranch(id, topographyBranch)) hasTopo = true;
            if (!hasHisto && idExistsInBranch(id, histologyBranch)) hasHisto = true;
            if (!hasData && idExistsInBranch(id, dataTypeBranch)) hasData = true;
            if (!hasAccess && idExistsInBranch(id, accessBranch)) hasAccess = true;
        });

        if (hasTopo && hasHisto && hasData && hasAccess) return 'complete';
        return 'incomplete';
    }

    // 2. Special Case: Welcome Screen
    if (sectionKey === 'welcome') return 'info';

    // 3. Schema-based Validation
    const sectionData = formData[sectionKey];

    // Check Root Level Requirement
    const isRootRequired = DATA_SCHEMA.required?.includes(sectionKey);

    if (isRootRequired && isEmpty(sectionData)) {
        return 'incomplete';
    }

    if (!isRootRequired && isEmpty(sectionData)) {
        return 'partial';
    }

    const sectionSchema = DATA_SCHEMA.properties[sectionKey];
    if (!sectionSchema) return 'error';

    let definition = sectionSchema;
    if (sectionSchema.$ref) definition = resolveRef(sectionSchema.$ref) || sectionSchema;
    else if (sectionSchema.allOf) {
         const refItem = sectionSchema.allOf.find(i => i.$ref);
         if (refItem) definition = resolveRef(refItem.$ref) || sectionSchema;
    } else if (sectionSchema.anyOf) {
         const validOption = sectionSchema.anyOf.find(i => i.type !== 'null');
         if (validOption) definition = (validOption.$ref ? resolveRef(validOption.$ref) : validOption) || sectionSchema;
    }

    // Array Types
    if (definition.type === 'array') {
        return 'complete';
    }

    // Object Types
    const requiredProps = definition.required || [];
    const allProps = definition.properties ? Object.keys(definition.properties) : [];
    const dataObj = sectionData || {};

    for (const req of requiredProps) {
        if (isEmpty(dataObj[req])) return 'incomplete';
    }

    const optionalProps = allProps.filter(p => !requiredProps.includes(p));
    if (optionalProps.length > 0) {
        const hasEmptyOptional = optionalProps.some(p => isEmpty(dataObj[p]));
        if (hasEmptyOptional) return 'partial';
    }

    return 'complete';
};

// --- Component: Status Icon ---
const StatusIcon = ({ status, isActive, isVisited }) => {
    if (isActive) {
        return (
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-sm ring-2 ring-blue-100 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
        );
    }

    if (!isVisited && status !== 'complete') {
        return (
            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300 flex-shrink-0"></div>
        );
    }

    switch (status) {
        case 'complete':
            return (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
            );
        case 'partial':
            return (
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-white font-bold text-sm">!</span>
                </div>
            );
        case 'incomplete':
            return (
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
            );
        default:
            return <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>;
    }
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

// --- Component: Welcome Section (RESTORED) ---
const WelcomeSection = ({ onUpload }) => (
    <div className="p-8 overflow-y-auto pb-20 w-full">
        <h1 className="text-3xl font-extrabold mb-4 text-gray-900">Guide to Uploading and Modifying Metadata</h1>

        <p className="text-sm text-gray-600 mb-1 leading-relaxed">
            If this is a new dataset, you can either input the metadata manually or, if you have done this before, you can directly upload a json with some or all of the required information.
            <JsonUpload
                schema={DATA_SCHEMA}
                onUpload={onUpload}
                additionalValidations={EXTRA_VALIDATIONS}
            />
        </p>

        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            To modify an existing dataset, choose from your existing datasets below to retrieve the existing information for manual adjustment, to download the data, or to upload amendments.
        </p>

        <div className="mb-6 max-w-lg">
            <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm text-gray-700 cursor-pointer"
                defaultValue=""
                onChange={(e) => {
                    if (e.target.value) {
                        alert(`You selected: ${e.target.options[e.target.selectedIndex].text}\n(Logic to load this dataset would go here)`);
                    }
                }}
            >
                <option value="" disabled>-- Select an existing dataset --</option>
                <option value="dataset1">Dataset for histopathology reports for prostatic carcinoma</option>
                <option value="dataset2">The Cancer Imaging Archive</option>
                <option value="dataset3">Longitudinal breast cancer data</option>
            </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Progress Legend</h2>
            <div className="space-y-1">

                {/* Complete */}
                <div className="flex items-center py-1 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                        <span className="text-gray-900 font-semibold text-sm">All fields complete</span>
                    </div>
                </div>

                {/* Partial */}
                <div className="flex items-center py-1 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                        <span className="text-white font-bold text-xs">!</span>
                    </div>
                    <div>
                        <span className="text-gray-900 font-semibold text-sm">Requirements met (optional fields remain)</span>
                    </div>
                </div>

                {/* Incomplete */}
                <div className="flex items-center py-1 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    <div>
                        <span className="text-gray-900 font-semibold text-sm">Action required</span>
                    </div>
                </div>

                {/* Active */}
                <div className="flex items-center py-1 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-3 shadow-sm ring-2 ring-blue-100 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                        <span className="text-gray-900 font-semibold text-sm">Current Section</span>
                    </div>
                </div>

                {/* Not Visited */}
                <div className="flex items-center py-1 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300 mr-3 shadow-sm flex-shrink-0"></div>
                    <div>
                        <span className="text-gray-900 font-semibold text-sm">Not Started</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

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

    // Helper: Robustly resolve definitions (handles anyOf with Nulls)
    const getDefinitionAndEnum = (p) => {
        let definition = p;

        // 1. Helper to resolve a Reference
        const resolve = (obj) => {
            if (obj && obj.$ref && typeof obj.$ref === 'string') {
                 return resolveRef(obj.$ref);
            }
            return obj;
        };

        // 2. Resolve initial ref
        definition = resolve(definition) || definition;

        // 3. Handle 'allOf' (Merge/Inheritance) - usually just one ref in this schema
        if (definition.allOf) {
            const refItem = definition.allOf.find(i => i.$ref);
            if (refItem) definition = resolve(refItem) || definition;
        }

        // 4. Handle 'anyOf' (Nullable fields or Choices)
        if (definition.anyOf) {
            // Filter out 'null' types to find the actual data definition
            const nonNullOptions = definition.anyOf.filter(i => {
                const r = resolve(i);
                return r && r.type !== 'null';
            });

            if (nonNullOptions.length > 0) {
                // Priority: Complex types (Array/Object) > Simple types
                const complexOption = nonNullOptions.find(i => {
                    const r = resolve(i);
                    return r.type === 'array' || r.type === 'object';
                });
                const selected = complexOption || nonNullOptions[0];
                definition = resolve(selected) || selected;
            }
        }

        const enumValues = definition.enum || prop.enum;
        // Explicitly check for array type in both resolved and original prop
        const isArray = prop.type === 'array' || definition.type === 'array';

        return { definition, enumValues, isArray };
    };

    const { definition: fieldDef, enumValues, isArray } = getDefinitionAndEnum(prop);
    const currentValue = getValueByPath(formData, path);

    // --- RENDER: ARRAY TYPES (e.g. Tables, Columns) ---
    if (isArray) {
        const items = Array.isArray(currentValue) ? currentValue : [];

        const handleAdd = () => {
            let itemSchema = fieldDef.items || {};
            let resolvedItemDef = itemSchema;

            // Resolve Item Definition logic...
            const resolve = (obj) => (obj && obj.$ref ? resolveRef(obj.$ref) : obj);

            if (itemSchema.$ref) {
                resolvedItemDef = resolveRef(itemSchema.$ref);
            } else if (itemSchema.anyOf) {
                 const validItem = itemSchema.anyOf.find(i => {
                     const r = i.$ref ? resolveRef(i.$ref) : i;
                     return r && r.type !== 'null';
                 });
                 if (validItem) resolvedItemDef = validItem.$ref ? resolveRef(validItem.$ref) : validItem;
            }

            // If the item is an Object (like DataTable or DataColumn), initialize as empty object {}
            const isObject = resolvedItemDef && (resolvedItemDef.type === 'object' || resolvedItemDef.properties);
            const newItem = isObject ? {} : '';

            // Update parent array (Append new item)
            onChange(path, [...items, newItem]);
        };

        const handleRemove = (index) => {
            onChange(path, items.filter((_, i) => i !== index));
        };

        return (
            <div className={`bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 ${level > 0 ? 'mt-4' : ''}`}>
                <label className="block text-lg font-bold text-gray-800 mb-2">{prop.title || propKey}</label>
                <p className="text-sm text-gray-600 mb-4">{prop.description}</p>

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="relative border-l-4 border-indigo-400 pl-4 py-4 bg-white rounded shadow-sm">
                            <button
                                onClick={() => handleRemove(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 border border-red-200 rounded z-10"
                            >
                                Remove
                            </button>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {fieldDef.title ? `${fieldDef.title} #${index + 1}` : `Item #${index + 1}`}
                            </h4>

                            {/* Render Inner Item Fields */}
                            {(() => {
                                let itemSchema = fieldDef.items || {};
                                let resolvedItemDef = itemSchema;
                                const resolve = (obj) => (obj && obj.$ref ? resolveRef(obj.$ref) : obj);
                                resolvedItemDef = resolve(itemSchema);

                                if (!resolvedItemDef.properties && resolvedItemDef.anyOf) {
                                     const valid = resolvedItemDef.anyOf.find(i => resolve(i).type !== 'null');
                                     if(valid) resolvedItemDef = resolve(valid);
                                }

                                if (resolvedItemDef && resolvedItemDef.properties) {
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
                    + Add {prop.title ? prop.title.slice(0, -1) : 'Item'}
                </button>
            </div>
        );
    }

    // --- RENDER: STANDARD INPUTS ---
    let inputType = 'text';
    let rows = 1;
    const examples = prop.examples;
    let placeholder = examples && examples.length > 0 ? examples.join(', ') : 'Enter value...';
    const showMarkdownToggle = prop.showMarkdown === "True";

    // DETECTION LOGIC: File Upload (For ERD)
    // Check if the schema property has contentMediaType set to an image type
    if (prop.contentMediaType && prop.contentMediaType.startsWith('image/')) {
        inputType = 'file';
    } else if (showMarkdownToggle || (prop.title && (prop.title.includes("Description") || prop.title.includes("Guidance") || prop.title.includes("Abstract")))) {
        inputType = 'textarea';
        rows = 4;
    } else if (fieldDef.type === 'integer' || fieldDef.type === 'number') {
        inputType = 'number';
    } else if (fieldDef.type === 'boolean') {
        inputType = 'checkbox';
    } else if (enumValues) {
        inputType = 'select-single';
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

    // HANDLER: File Upload (Convert to Base64)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit check
                alert("File size exceeds 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(path, reader.result); // Stores "data:image/png;base64,..."
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 ${level > 0 ? 'ml-0' : ''}`}>
            <label className="block text-sm font-bold text-gray-700 mb-1">
                {prop.title || propKey} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <p className="text-xs text-gray-500 mb-2">{prop.description}</p>

            {/* PREVIEW for File Upload */}
            {inputType === 'file' && currentValue && (
                <div className="mb-2 p-2 border border-gray-200 rounded bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                    <img src={currentValue} alt="Preview" className="max-w-full h-auto max-h-64 rounded shadow-sm" />
                    <button
                        onClick={() => onChange(path, null)}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                        Remove Image
                    </button>
                </div>
            )}

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
            ) : inputType === 'select-single' ? (
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
                    {/* Toggle Switch UI */}
                    <button
                        type="button"
                        className={`${
                            !!currentValue ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                        role="switch"
                        aria-checked={!!currentValue}
                        onClick={() => {
                            // Toggle logic
                            onChange(path, !currentValue);
                            handleFocus();
                        }}
                        onFocus={handleFocus}
                    >
                        <span
                            aria-hidden="true"
                            className={`${
                                !!currentValue ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                    </button>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                        {!!currentValue ? 'Yes' : 'No'}
                    </span>
                 </div>
            ) : inputType === 'file' ? (
                <input
                    type="file"
                    accept="image/*"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onFocus={handleFocus}
                    onChange={handleFileChange}
                />
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
const SchemaForm = ({ sectionKey, formData, onFormChange, setActiveGuidance, onUpload }) => {

    // 0. Welcome Section
    if (sectionKey === 'welcome') {
        return (
            <div className="w-full flex h-full">
                <WelcomeSection onUpload={onUpload} />
            </div>
        );
    }

    // 1. Data Tagger
    if (sectionKey === 'datasetFilters') {
        return (
            <div className="w-2/4 p-8 overflow-y-auto pb-20">
                <h1 className="text-3xl font-extrabold mb-2 text-gray-800">Dataset Filters</h1>
                <p className="text-gray-600 mb-8 border-b pb-4">
                    Tag your dataset with specific filters (Cancer Type, Data Type, Access) to improve searchability.
                    <br/><span className="text-sm text-red-600 font-bold mt-2 block">
                        Required: At least one Topography, one Histology, one Data Type, and one Access Type.
                    </span>
                </p>
                <DataTagger
                    value={formData['datasetFilters'] || []}
                    onChange={(newTags) => onFormChange(['datasetFilters'], newTags)}
                />
            </div>
        );
    }

    const sectionSchema = DATA_SCHEMA.properties ? DATA_SCHEMA.properties[sectionKey] : null;

    if (!sectionSchema) return <p className="p-8">Section not found or Schema is invalid.</p>;

    const resolveDefinition = (s) => {
        if (!s) return null;
        let ref = s.$ref;
        if (!ref) ref = s.allOf?.find(i => i.$ref)?.$ref;
        if (!ref && s.anyOf) {
             const validOption = s.anyOf.find(i => i.type !== 'null');
             if (validOption) {
                 return validOption.$ref ? resolveRef(validOption.$ref) : validOption;
             }
        }
        if (ref) return resolveRef(ref);
        return s;
    };

    const definition = resolveDefinition(sectionSchema);
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
                        // CHECK: Is this section in the priority list?
                        // If so, pass 'sectionSchema' (the original prop with correct title/desc/guidance)
                        // If not, pass 'definition' (resolved) as default behavior to ensure type resolution works
                        prop={METADATA_PRIORITY_SECTIONS.includes(sectionKey) ? sectionSchema : (definition || sectionSchema)}
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
const SchemaNav = ({ activeSection, setActiveSection, onDownload, formData, visitedSections }) => {
    return (
        <div className="w-1/5 border-r border-gray-200 bg-gray-50 h-full overflow-y-auto flex-shrink-0">
            <div className="p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Metadata Sections</h2>
                <ul className="space-y-2">
                    {VISIBLE_SECTIONS.map((sectionKey) => {
                        let title;
                        if (sectionKey === 'datasetFilters') {
                            title = "Dataset Filters";
                        } else if (sectionKey === 'welcome') {
                            title = "Welcome & Guide";
                        } else {
                            // Title logic matching user requirement
                            const prop = DATA_SCHEMA.properties[sectionKey];
                            const definition = prop?.$ref ? resolveRef(prop.$ref) : prop;
                            title = prop?.title || definition?.title || (sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1));
                        }

                        if (sectionKey !== 'datasetFilters' && sectionKey !== 'welcome' && !DATA_SCHEMA.properties[sectionKey]) return null;

                        const status = calculateSectionStatus(sectionKey, formData);
                        const isVisited = visitedSections.has(sectionKey);

                        return (
                            <li key={sectionKey}>
                                <button
                                    onClick={() => setActiveSection(sectionKey)}
                                    className={`w-full text-left p-3 rounded-md transition-colors duration-150 text-sm font-medium flex items-center justify-between group ${
                                        activeSection === sectionKey
                                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                            : 'text-gray-700 hover:bg-white hover:shadow-sm'
                                    }`}
                                >
                                    <span className="flex-grow">{title}</span>
                                    {sectionKey !== 'welcome' && (
                                        <StatusIcon
                                            status={status}
                                            isActive={activeSection === sectionKey}
                                            isVisited={isVisited}
                                        />
                                    )}
                                </button>
                            </li>
                        );
                    })}
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
    <div className="w-1/4 border-l border-gray-200 p-6 bg-gray-50 h-full overflow-y-auto flex-shrink-0">
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

    // Initialize with Welcome section
    const initialSection = VISIBLE_SECTIONS[0] || Object.keys(DATA_SCHEMA.properties)[0];
    const [activeSection, setActiveSection] = useState(initialSection);
    const [activeGuidance, setActiveGuidance] = useState(null);

    // Track visited sections (Start with the initial one)
    const [visitedSections, setVisitedSections] = useState(new Set([initialSection]));

    const handleNavChange = (key) => {
        setVisitedSections(prev => new Set(prev).add(key));
        setActiveSection(key);
        setActiveGuidance(null);
    };

    // --- UPDATED HANDLE DATA CHANGE (DEEP MERGE + LOGGING) ---
    const handleDataChange = useCallback((path, value) => {
        console.group("Data Change Debug");
        console.log("1. Path being updated:", path);
        console.log("2. New Value to set:", value);

        setFormData(prev => {
            console.log("3. State BEFORE update:", JSON.parse(JSON.stringify(prev)));

            const newData = { ...prev };
            let current = newData;

            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                const nextKey = path[i + 1];

                // Ensure the current level exists
                if (current[key] === undefined) {
                    current[key] = typeof nextKey === 'number' ? [] : {};
                }

                // Clone the container to ensure we don't mutate state directly
                // but ONLY clone the branch we are traversing (preserving siblings)
                if (Array.isArray(current[key])) {
                    current[key] = [...current[key]];
                } else {
                    current[key] = { ...current[key] };
                }

                // Move pointer down
                current = current[key];
            }

            // Set the value at the target
            current[path[path.length - 1]] = value;

            console.log("4. State AFTER update:", JSON.parse(JSON.stringify(newData)));
            console.groupEnd();

            return newData;
        });
    }, []);

    const preprocessData = (data, schemaDefinition) => {
        if (!data || typeof data !== 'object') return data;

        const newData = Array.isArray(data) ? [...data] : { ...data };

        // 1. Fix Structural Metadata Structure (Wrap Array in Object if needed)
        if (Array.isArray(newData.structuralMetadata)) {
            newData.structuralMetadata = { tables: newData.structuralMetadata };
        }

        // 2. Merge Duplicate Tables (The Fix for your specific issue)
        if (newData.structuralMetadata && Array.isArray(newData.structuralMetadata.tables)) {
            const tableMap = new Map();

            newData.structuralMetadata.tables.forEach(table => {
                // Use Table Name as the unique key
                const tableName = table.name;

                if (tableName && tableMap.has(tableName)) {
                    // If table exists, merge the new columns into the existing table
                    const existingTable = tableMap.get(tableName);
                    const newColumns = table.columns || [];

                    // Safely combine columns
                    existingTable.columns = [...(existingTable.columns || []), ...newColumns];

                    // Optional: If the existing description is empty but the new one isn't, use the new one
                    if (!existingTable.description && table.description) {
                        existingTable.description = table.description;
                    }
                } else {
                    // First time seeing this table? Add it to our map.
                    // We deep clone it to ensure we don't mess up references.
                    tableMap.set(tableName, JSON.parse(JSON.stringify(table)));
                }
            });

            // Convert the map back into an array
            newData.structuralMetadata.tables = Array.from(tableMap.values());
        }

        // 3. Standard Recursive Cleaning
        Object.keys(newData).forEach(key => {
            if (key === 'keywords' && typeof newData[key] === 'string' && newData[key].includes(';,;')) {
                newData[key] = newData[key].split(';,;');
            }

            if (typeof newData[key] === 'object' && newData[key] !== null) {
                newData[key] = preprocessData(newData[key], schemaDefinition);
            }
        });

        return newData;
    };

    const handleJsonUpload = useCallback((uploadedData) => {
        // Preprocess the data to fix known serialization issues (like keywords)
        const cleanData = preprocessData(uploadedData, DATA_SCHEMA);

        setFormData(cleanData);

        const allSections = Object.keys(DATA_SCHEMA.properties);
        setVisitedSections(new Set([...allSections, 'datasetFilters', 'welcome']));
    }, [DATA_SCHEMA]);

    const handleTagRemove = (id) => {
        const currentTags = formData['datasetFilters'] || [];
        const newTags = currentTags.filter(tagId => tagId !== id);
        handleDataChange(['datasetFilters'], newTags);
    };

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
        <div className="flex flex-col min-h-screen font-sans bg-white">
            {/* Top Bar Added Here */}
            <UploadTopBar formData={formData} schema={DATA_SCHEMA} />

            <div className="flex flex-grow overflow-hidden h-[calc(100vh-40px)]">
                <SchemaNav
                    activeSection={activeSection}
                    setActiveSection={handleNavChange}
                    onDownload={downloadJSON}
                    formData={formData}
                    visitedSections={visitedSections}
                />

                {/* Middle and Right Columns Logic */}
                {activeSection === 'welcome' ? (
                    // Welcome Section spans 80% (4/5) because nav is 20% (1/5)
                    <div className="w-4/5 flex h-full">
                        <SchemaForm
                            sectionKey={activeSection}
                            formData={formData}
                            onFormChange={handleDataChange}
                            setActiveGuidance={setActiveGuidance}
                            onUpload={handleJsonUpload}
                        />
                    </div>
                ) : (
                    <>
                        <SchemaForm
                            sectionKey={activeSection}
                            formData={formData}
                            onFormChange={handleDataChange}
                            setActiveGuidance={setActiveGuidance}
                            onUpload={handleJsonUpload}
                        />

                        {/* Right Column Logic */}
                        {activeSection === 'datasetFilters' ? (
                            <div className="w-1/4 border-l border-gray-200 p-6 bg-gray-50 h-full overflow-y-auto">
                                <h2 className="text-lg font-bold mb-4 text-gray-700">Active Tags</h2>
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 min-h-[200px]">
                                    <FilterChipArea
                                        selectedFilters={formData['datasetFilters'] || []}
                                        handleFilterChange={handleTagRemove}
                                    />
                                </div>
                            </div>
                        ) : (
                            <GuidancePanel
                                activeGuidance={activeGuidance}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SchemaPage;
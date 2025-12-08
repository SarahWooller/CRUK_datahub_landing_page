import React, { useState } from 'react';
// UPDATED: Use the new file name
import schema from '../utils/schema.json';

// --- Utility Function to Resolve JSON References ---
/**
 * Resolves a JSON Schema $ref string to the actual definition object.
 * @param {string} ref - The $ref string (e.g., "#/$defs/Summary")
 * @returns {object|null} The referenced schema definition.
 */
const resolveRef = (ref) => {
    if (!ref || typeof ref !== 'string' || !ref.startsWith('#/$defs/')) {
        return null;
    }
    const defKey = ref.split('/').pop();
    return schema.$defs[defKey] || null;
};

// --- Utility Function 1: Render Guidance (Simple Markdown) ---
/**
 * Renders guidance text, handling bold (**text**) and line breaks (\n).
 * Used for the static Guidance Panel.
 */
const renderGuidance = (guidanceText) => {
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

// --- Utility Component 2: Markdown Renderer (Complex Markdown) ---
/**
 * Renders content, handling bold, italics, links, and newlines.
 * Used for the input box preview.
 */
const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    // Convert newlines in the raw content to <p> tags for block rendering
    const lineBlocks = content.split('\n');

    return (
        <div className="markdown-output space-y-2">
            {lineBlocks.map((line, lineIndex) => {
                if (!line.trim()) return <p key={lineIndex} className="mb-0">&nbsp;</p>;

                // Regex to split by bold (**), italics (*), and links ([text](url))
                const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);

                return (
                    <p key={lineIndex} className="mb-0">
                        {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                            } else if (part.startsWith('*') && part.endsWith('*')) {
                                // Simple italics
                                return <em key={partIndex}>{part.slice(1, -1)}</em>;
                            } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
                                // Basic Link parsing
                                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                if (match && match.length === 3) {
                                    const [_, text, url] = match;
                                    return (
                                        <a key={partIndex} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                            {text}
                                        </a>
                                    );
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

// --- Component 1: Left Navigation ---
const SchemaNav = ({ activeSection, setActiveSection }) => (
    <div className="w-1/5 border-r border-gray-200 p-6 bg-gray-50 h-screen overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Metadata Sections</h2>
        <ul className="space-y-2">
            {Object.keys(schema.properties).map((sectionKey) => (
                <li key={sectionKey}>
                    <button
                        onClick={() => setActiveSection(sectionKey)}
                        className={`w-full text-left p-2 rounded-md transition-colors duration-150 ${
                            activeSection === sectionKey
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'text-gray-700 hover:bg-indigo-100'
                        }`}
                    >
                        {schema.properties[sectionKey]?.title || sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
                    </button>
                </li>
            ))}
        </ul>
    </div>
);

// --- Component 2: Right Guidance Panel ---
const GuidancePanel = ({ activeGuidance }) => (
    <div className="w-1/4 border-l border-gray-200 p-6 bg-gray-50 h-screen sticky top-0 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Field Guidance</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {activeGuidance ? (
                <>
                    <h3 className="text-md font-semibold mb-2">{activeGuidance.title}</h3>
                    <div className="text-sm text-gray-600 leading-relaxed">
                        {renderGuidance(activeGuidance.guidance)}
                    </div>
                </>
            ) : (
                <p className="text-sm text-gray-500">
                    Click on a form field in the middle column to see contextual guidance here.
                </p>
            )}
        </div>
    </div>
);

// --- Component 3: Field Renderer ---
const FieldRenderer = ({ propKey, prop, isRequired, setActiveGuidance }) => {
    const [isMarkdownToggled, setIsMarkdownToggled] = useState(false);

    // Helper to resolve the deepest definition and check for enum
    const getDefinitionAndEnum = (p) => {
        let definition = p;
        // Check for $ref inside allOf or anyOf items
        let ref = p.$ref || p.allOf?.find(item => item.$ref)?.$ref || p.anyOf?.find(item => item.$ref)?.$ref;
        if (p.type === 'array' && p.items) {
            ref = p.items.$ref || p.items.anyOf?.find(item => item.$ref)?.$ref;
        }
        if (ref) {
            definition = resolveRef(ref);
        }
        const enumValues = definition?.enum || p.enum;
        return { definition: definition || p, enumValues, isArray: p.type === 'array' };
    };

    const { definition: fieldDef, enumValues, isArray } = getDefinitionAndEnum(prop);

    let inputType = 'text';
    let rows = 1;

    const examples = prop.examples;
    let placeholder = 'Enter value...';
    const hasMultipleExamples = examples && examples.length > 1;
    const showMarkdownToggle = prop.showMarkdown === "True";

    if (examples?.length > 0) {
        placeholder = examples.join('\n');
    }

    if (enumValues) {
        inputType = isArray ? 'select-multi' : 'select-single';
    }

    if (showMarkdownToggle || hasMultipleExamples || (fieldDef.title && (fieldDef.title.includes("Abstract") || fieldDef.title.includes("LongDescription") || fieldDef.title.includes("Description")))) {
        inputType = 'textarea';
        rows = hasMultipleExamples ? examples.length : 4;
        rows = Math.max(rows, 3);
    } else if (prop.type === 'integer') {
        inputType = 'number';
    } else if (fieldDef.title === "Organisation") {
        inputType = 'nested-form';
        placeholder = 'Click to configure Organisation details...';
    } else if (fieldDef.title === "EmailAddress") {
        inputType = 'email';
    }

    const handleFocus = () => {
        const guidance = prop.guidance || prop.description || 'No specific guidance provided.';
        setActiveGuidance({ title: prop.title || propKey, guidance });
    };

    return (
        <div key={propKey} className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-1">
                {prop.title || propKey} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <p className="text-sm text-gray-500 mb-3">{prop.description}</p>

            {/* Markdown Toggle Button */}
            {showMarkdownToggle && inputType === 'textarea' && (
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => setIsMarkdownToggled(prev => !prev)}
                        className={`text-xs px-3 py-1 rounded-full transition-colors duration-150 ${
                            isMarkdownToggled
                                ? 'bg-green-100 text-green-700 font-semibold'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        type="button"
                    >
                        {isMarkdownToggled ? 'Markdown Preview ON' : 'Show Markdown Preview'}
                    </button>
                </div>
            )}

            {/* --- Conditional Rendering for Form Elements --- */}
            {inputType === 'textarea' && isMarkdownToggled ? (
                // RENDER MODE: Show the Markdown preview of the placeholder/examples
                <div className="w-full p-3 border border-indigo-500 rounded-md bg-indigo-50 min-h-[5rem] overflow-y-auto">
                    <MarkdownRenderer content={placeholder} />
                </div>
            ) : inputType === 'select-single' && enumValues ? (
                // Single-select Dropdown
                <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    onFocus={handleFocus}
                >
                    <option value="">-- Select an option --</option>
                    {enumValues.map((option) => (
                        <option key={option} value={option || ''}>
                            {option === null ? 'N/A' : option}
                        </option>
                    ))}
                </select>
            ) :

            /* Multi-select (Checkboxes for simplicity) */
            inputType === 'select-multi' && enumValues ? (
                <div className="space-y-2 max-h-48 overflow-y-auto border p-3 rounded-md border-gray-300">
                    {enumValues.map((option) => (
                        <div key={option} className="flex items-center">
                            <input
                                id={`${propKey}-${option}`}
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                onFocus={handleFocus}
                            />
                            <label htmlFor={`${propKey}-${option}`} className="ml-2 block text-sm text-gray-700">
                                {option === null ? 'N/A' : option}
                            </label>
                        </div>
                    ))}
                </div>
            ) :

            /* Textarea (Edit Mode) */
            inputType === 'textarea' ? (
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={placeholder}
                    rows={rows}
                    onFocus={handleFocus}
                    style={{
                        border: showMarkdownToggle ? '1px dashed #A5B4FC' : undefined,
                        backgroundColor: showMarkdownToggle ? '#F5F5FF' : undefined
                    }}
                />
            ) :

            /* Nested Form (Complex Object) */
            inputType === 'nested-form' ? (
                <div
                    className="p-3 bg-indigo-50 border border-indigo-200 rounded-md cursor-pointer text-indigo-700 hover:bg-indigo-100"
                    onClick={() => alert(`Simulating navigation/modal for ${propKey} details`)}
                    onFocus={handleFocus}
                >
                    {placeholder}
                </div>
            ) : (

                /* Standard Input (Text, Number, Email) */
                <input
                    type={inputType}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={placeholder}
                    onFocus={handleFocus}
                />
            )}
        </div>
    );
};


// --- Component 4: Middle Form (Detail View) (Fixed) ---
const SchemaForm = ({ sectionKey, setActiveGuidance }) => {
    const sectionSchema = schema.properties[sectionKey];
    if (!sectionSchema) return <p className="p-8">Section not found.</p>;

    /**
     * Finds the actual object definition by resolving $ref inside allOf or anyOf.
     */
    const findDefinition = (schemaProp) => {
        let ref;

        // 1. Check for a direct $ref
        ref = schemaProp.$ref;
        if (ref) return resolveRef(ref);

        // 2. Check inside allOf for a $ref
        ref = schemaProp.allOf?.find(item => item.$ref)?.$ref;
        if (ref) return resolveRef(ref);

        // 3. NEW FIX: Check inside anyOf for a $ref (ignoring 'type: null')
        ref = schemaProp.anyOf?.find(item => item.$ref)?.$ref;
        if (ref) return resolveRef(ref);

        return null;
    };

    // 1. Find the actual definition using the new helper
    const definition = findDefinition(sectionSchema);

    // Determine if it's a simple top-level field (no complex definition found)
    const isSimpleTopLevel = !definition && Object.keys(sectionSchema).length > 0 && schema.required.includes(sectionKey);

    // Get keys from the definition's properties, or just the section key if simple
    const propertyKeys = definition?.properties ? Object.keys(definition.properties) : isSimpleTopLevel ? [sectionKey] : [];
    const requiredProps = definition?.required || [];

    // Simple top-level fields (like 'identifier' or 'version')
    if (isSimpleTopLevel) {
        return (
            <div className="w-2/4 p-8 overflow-y-auto">
                <h1 className="text-2xl font-extrabold mb-6 text-gray-800">
                    {sectionSchema.title || sectionKey}
                </h1>
                <p className="text-gray-600 mb-8">{sectionSchema.description}</p>
                <FieldRenderer
                    propKey={sectionKey}
                    prop={sectionSchema}
                    isRequired={schema.required.includes(sectionKey)}
                    setActiveGuidance={setActiveGuidance}
                />
            </div>
        );
    }

    // Complex sections (like 'summary' or 'documentation')
    if (!definition || !definition.properties) {
        // This will only be reached if a reference was found, but the target definition
        // does not contain a 'properties' field (which shouldn't happen for a complex object)
        // or if a section is defined in a way we haven't covered.
        return <p className="p-8">Definition for "{sectionKey}" is complex or missing properties.</p>;
    }

    return (
        <div className="w-2/4 p-8 overflow-y-auto">
            <h1 className="text-2xl font-extrabold mb-6 text-gray-800">
                {definition.title || sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
            </h1>

            <p className="text-gray-600 mb-8">{sectionSchema.description}</p>

            <div className="space-y-8">
                {propertyKeys.map((propKey) => {
                    const prop = definition.properties[propKey];
                    const isRequired = requiredProps.includes(propKey);
                    return (
                        <FieldRenderer
                            key={propKey}
                            propKey={propKey}
                            prop={prop}
                            isRequired={isRequired}
                            setActiveGuidance={setActiveGuidance}
                        />
                    );
                })}
            </div>
        </div>
    );
};


// --- Main Application Component ---
const SchemaPage = () => {
    // Get ALL top-level properties keys for the nav
    const allSections = Object.keys(schema.properties);

    // State to track the active nav section (defaulting to 'summary')
    const [activeSection, setActiveSection] = useState('summary');

    // State to track the guidance content for the currently focused form field
    const [activeGuidance, setActiveGuidance] = useState(null);

    // Handler to reset guidance when a new section is clicked
    const handleNavClick = (sectionKey) => {
        setActiveSection(sectionKey);
        setActiveGuidance(null);
    };

    return (
        <div className="flex min-h-screen font-sans">
            {/* Column 1: Navigation */}
            <SchemaNav
                allSections={allSections}
                activeSection={activeSection}
                setActiveSection={handleNavClick}
            />

            {/* Column 2: Detail Form */}
            <SchemaForm
                sectionKey={activeSection}
                setActiveGuidance={setActiveGuidance}
            />

            {/* Column 3: Contextual Guidance */}
            <GuidancePanel
                activeGuidance={activeGuidance}
            />
        </div>
    );
};

// Export the main component for use
export default SchemaPage;
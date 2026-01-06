import React, { useState, useRef } from 'react';

const JsonUpload = ({ schema, onUpload, additionalValidations = {} }) => {
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const validateAndParse = (jsonContent) => {
        try {
            const data = JSON.parse(jsonContent);

            // 1. Basic Structure Check
            if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                throw new Error("Invalid JSON structure. Expected a root object.");
            }

            // 2. Dynamic Validation
            const allowedSchemaKeys = Object.keys(schema.properties || {});
            const requiredKeys = schema.required || [];

            const cleanData = {};
            const missingRequired = [];
            const unknownFields = [];

            // -- Filter & Validate Fields --
            Object.keys(data).forEach(key => {
                // A. Check against standard Schema
                if (allowedSchemaKeys.includes(key)) {
                    cleanData[key] = data[key];
                }
                // B. Check against Additional Validations (e.g., datasetFilters)
                else if (additionalValidations[key]) {
                    const validator = additionalValidations[key];
                    if (validator(data[key])) {
                        cleanData[key] = data[key];
                    } else {
                        unknownFields.push(`${key} (invalid format)`);
                    }
                }
                // C. Unknown Field
                else {
                    unknownFields.push(key);
                }
            });

            // -- Check required fields --
            requiredKeys.forEach(reqKey => {
                if (!cleanData.hasOwnProperty(reqKey)) {
                    missingRequired.push(reqKey);
                }
            });

            return {
                valid: true,
                data: cleanData,
                messages: { missingRequired, unknownFields }
            };

        } catch (e) {
            return { valid: false, error: e.message };
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset UI
        setError(null);
        setSuccessMsg(null);

        if (file.type && file.type !== "application/json") {
            setError("Please upload a valid .json file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = validateAndParse(event.target.result);

            if (!result.valid) {
                setError(`Failed to parse JSON: ${result.error}`);
                return;
            }

            const { missingRequired, unknownFields } = result.messages;
            let msg = "File uploaded successfully!";

            if (missingRequired.length > 0) {
                msg += ` Note: The following required fields were missing: ${missingRequired.join(", ")}.`;
            }
            if (unknownFields.length > 0) {
                console.warn("Stripped fields:", unknownFields);
            }

            setSuccessMsg(msg);
            onUpload(result.data);
        };

        reader.onerror = () => {
            setError("Error reading file.");
        };

        reader.readAsText(file);
        e.target.value = null;
    };

    return (
        <div className="inline-block ml-2 align-middle">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: 'none' }}
            />

            <button
                onClick={handleButtonClick}
                className="bg-[var(--cruk-blue)] hover:opacity-90 text-white text-sm font-medium py-1 px-3 rounded inline-flex items-center transition-colors shadow-sm"
            >
                <svg className="fill-current w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                </svg>
                <span>Upload JSON</span>
            </button>

            {error && (
                <div className="absolute mt-2 text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200 z-50 shadow-md">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {successMsg && (
                <div className={`absolute mt-2 text-xs p-2 rounded border z-50 shadow-md ${successMsg.includes("missing") ? "text-orange-800 bg-orange-50 border-orange-200" : "text-green-800 bg-green-50 border-green-200"}`}>
                    {successMsg}
                </div>
            )}
        </div>
    );
};

export default JsonUpload;
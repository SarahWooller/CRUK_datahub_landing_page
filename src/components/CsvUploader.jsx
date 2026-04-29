import React from 'react';
import Papa from 'papaparse';

const CsvUploader = ({ onDataParsed }) => {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                let parsedData = results.data;

                if (parsedData.length > 0) {
                    // Read the 'sensitive' value from the first row
                    // Note: CSV parses everything as strings, so this will be "true" or "false"
                    const firstRowSensitive = parsedData[0].sensitive;

                    parsedData = parsedData.map((row, index) => {
                        if (index === 0) return row;

                        // Apply the default to subsequent rows if they do not have a value specified
                        return {
                            ...row,
                            sensitive: (row.sensitive !== undefined && row.sensitive.trim() !== "")
                                ? row.sensitive
                                : firstRowSensitive
                        };
                    });
                }

                // Pass the processed array up to the parent state
                onDataParsed(parsedData);
            },
            error: (error) => {
                console.error("Error parsing CSV:", error);
            }
        });
    };

    return (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload File of Structural Metadata.
            </label>
            <p>If you've done this before you can upload a .csv or single-sheeted .xls file here, and then edit it below.</p>
            <p> Alternatively manually create your table below.</p>

            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
        </div>
    );
};

export default CsvUploader;
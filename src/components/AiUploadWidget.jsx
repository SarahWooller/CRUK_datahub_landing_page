import React, { useState, useCallback } from 'react';

const mockExtractedData = {
    summary: {
        title: "Optimam",
        abstract: "The OPTIMAM Mammography Image Database is a sharable resource with processed and unprocessed mammography images from United Kingdom breast screening centers, with annotated cancers and clinical details.",
        populationSize: 470000,
        keywords: ["Mammography", "Tomosynthesis", "Malignant"],
        datasetAliases: ["OMI-DB"],
        contactPoint: "jakob.kridl@cancer.org.uk"
    },
    documentation: {
        associatedMedia: ["https://medphys.royalsurrey.nhs.uk/department/optimam/"],
        inPipeline: "Available",
        description: "The OPTIMAM Mammography Image Database (OMI-DB) provides a centralized, fully annotated dataset for research. It includes serial screening mammograms collected over a 10-year period from over 170,000 women.\n\n## DATA RESOURCES\n The development of artificial intelligence software to improve the outcomes of breast screening relies on the availability of well-curated image databases..."
    }
};

const AiUploadWidget = ({ formData, onFormChange }) => {
    const [dragActive, setDragActive] = useState(false);
    const [processingState, setProcessingState] = useState('idle'); // 'idle', 'processing', 'conflict', 'done'
    const [conflicts, setConflicts] = useState([]);
    const [resolvedData, setResolvedData] = useState({});

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            startProcessing();
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            startProcessing();
        }
    };

    const startProcessing = () => {
        setProcessingState('processing');
        // Simulate API call
        setTimeout(() => {
            analyzeDataAndFindConflicts();
        }, 2000);
    };

    const analyzeDataAndFindConflicts = () => {
        const foundConflicts = [];
        const toApply = {};

        // Mock checking a few fields
        const checkField = (path, newText) => {
            let currentVal = formData;
            for (const key of path) {
                if (currentVal) currentVal = currentVal[key];
            }
            
            if (currentVal && typeof currentVal === 'string' && currentVal.trim() !== '' && currentVal !== newText) {
                // We have a text conflict
                // Mock an AI devised text and contradiction flag
                const isContradiction = Math.random() > 0.5; // Simulate sometimes finding a contradiction
                let devisedText = `[AI MERGED] ${currentVal} ... ${newText.substring(0, 50)}...`;
                
                let contradictionFlag = "";
                if (isContradiction) {
                    contradictionFlag = "Warning: The incoming document states a different population size or core focus than the existing text.";
                    devisedText = `[AI RECONCILED] ${newText}`;
                }

                foundConflicts.push({
                    path,
                    original: currentVal,
                    incoming: newText,
                    devised: devisedText,
                    contradiction: contradictionFlag,
                    choice: 'devised' // default choice
                });
            } else {
                // No conflict, or just arrays/objects to merge directly (simplified for mock)
                toApply[path.join('.')] = newText;
            }
        };

        checkField(['summary', 'abstract'], mockExtractedData.summary.abstract);
        checkField(['documentation', 'description'], mockExtractedData.documentation.description);

        if (foundConflicts.length > 0) {
            setConflicts(foundConflicts);
            setResolvedData(toApply);
            setProcessingState('conflict');
        } else {
            // Apply all directly
            applyUpdates(toApply);
            setProcessingState('done');
        }
    };

    const applyUpdates = (updates) => {
        // Iterate and apply
        Object.keys(updates).forEach(pathStr => {
            const pathArr = pathStr.split('.');
            onFormChange(pathArr, updates[pathStr]);
        });
        
        // Also apply the rest of the mock data that wasn't conflict-checked for the sake of the demo
        if (!updates['summary.title']) onFormChange(['summary', 'title'], mockExtractedData.summary.title);
        if (!updates['summary.populationSize']) onFormChange(['summary', 'populationSize'], mockExtractedData.summary.populationSize);
        if (!updates['summary.keywords']) onFormChange(['summary', 'keywords'], mockExtractedData.summary.keywords);
    };

    const handleResolveConflict = (index, choice) => {
        const newConflicts = [...conflicts];
        newConflicts[index].choice = choice;
        setConflicts(newConflicts);
    };

    const applyResolvedConflicts = () => {
        const finalUpdates = { ...resolvedData };
        conflicts.forEach(c => {
            let finalValue = c.devised;
            if (c.choice === 'original') finalValue = c.original;
            if (c.choice === 'incoming') finalValue = c.incoming;
            if (c.choice === 'devised') finalValue = c.devised;
            
            finalUpdates[c.path.join('.')] = finalValue;
        });
        applyUpdates(finalUpdates);
        setProcessingState('done');
    };

    const resetWidget = () => {
        setProcessingState('idle');
        setConflicts([]);
        setResolvedData({});
    };

    return (
        <div className="flex flex-col h-full bg-white text-sm">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">AI Document Extraction</h3>
                <p className="text-gray-500 text-xs mt-1">Upload a PDF or document to automatically extract dataset metadata.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {processingState === 'idle' && (
                    <div 
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <svg className="w-10 h-10 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="text-gray-600 mb-2">Drag and drop your document here</p>
                        <p className="text-xs text-gray-400 mb-4">Supported: PDF, DOCX, PPTX</p>
                        
                        <label className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer text-sm font-medium transition-colors">
                            Browse Files
                            <input type="file" className="hidden" onChange={handleChange} />
                        </label>
                    </div>
                )}

                {processingState === 'processing' && (
                    <div className="flex flex-col items-center justify-center h-48">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-700 font-medium text-center">Analyzing document...</p>
                        <p className="text-xs text-gray-500 mt-2 text-center max-w-xs">Extracting clinical, demographic, and multi-omic details into schema format.</p>
                    </div>
                )}

                {processingState === 'conflict' && (
                    <div className="flex flex-col gap-6">
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 text-amber-800 rounded">
                            <p className="font-bold mb-1">Conflicts Detected</p>
                            <p className="text-xs">The uploaded document contains information that conflicts with existing data in the form. Please review the AI's suggested merged text.</p>
                        </div>

                        {conflicts.map((conflict, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                                    <span className="font-mono text-xs font-bold text-gray-700">{conflict.path.join('.')}</span>
                                </div>
                                
                                {conflict.contradiction && (
                                    <div className="bg-red-50 text-red-700 p-2 text-xs border-b border-red-100 flex items-start gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                        <span><strong>Contradiction Flagged:</strong> {conflict.contradiction}</span>
                                    </div>
                                )}

                                <div className="p-4 flex flex-col gap-4">
                                    {/* AI Devised (Recommended) */}
                                    <label className={`block border p-3 rounded-md cursor-pointer transition-colors ${conflict.choice === 'devised' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <input type="radio" checked={conflict.choice === 'devised'} onChange={() => handleResolveConflict(index, 'devised')} className="text-indigo-600 focus:ring-indigo-500" />
                                            <span className="font-bold text-indigo-900 text-xs uppercase tracking-wider">AI Devised Text</span>
                                        </div>
                                        <div className="text-gray-700 text-sm pl-5 whitespace-pre-wrap">{conflict.devised}</div>
                                    </label>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Original */}
                                        <label className={`block border p-3 rounded-md cursor-pointer transition-colors ${conflict.choice === 'original' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <input type="radio" checked={conflict.choice === 'original'} onChange={() => handleResolveConflict(index, 'original')} className="text-indigo-600 focus:ring-indigo-500" />
                                                <span className="font-bold text-gray-700 text-xs uppercase tracking-wider">Keep Existing</span>
                                            </div>
                                            <div className="text-gray-500 text-xs pl-5 line-clamp-4">{conflict.original}</div>
                                        </label>

                                        {/* Incoming */}
                                        <label className={`block border p-3 rounded-md cursor-pointer transition-colors ${conflict.choice === 'incoming' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <input type="radio" checked={conflict.choice === 'incoming'} onChange={() => handleResolveConflict(index, 'incoming')} className="text-indigo-600 focus:ring-indigo-500" />
                                                <span className="font-bold text-gray-700 text-xs uppercase tracking-wider">Use New Text Only</span>
                                            </div>
                                            <div className="text-gray-500 text-xs pl-5 line-clamp-4">{conflict.incoming}</div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button 
                            onClick={applyResolvedConflicts}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            Apply Selected Resolutions
                        </button>
                    </div>
                )}

                {processingState === 'done' && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 mb-1">Extraction Complete</h4>
                        <p className="text-gray-500 text-center mb-6">Metadata has been successfully extracted and applied to the form.</p>
                        <button 
                            onClick={resetWidget}
                            className="text-indigo-600 font-semibold hover:text-indigo-800 text-sm"
                        >
                            Upload another document
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiUploadWidget;

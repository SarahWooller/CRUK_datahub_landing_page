import React, { useState, useEffect, useMemo } from 'react';

const generateMockStudies = () => {
    const titles = [
        "Genomic Profiling of Triple-Negative Breast Cancer", "AI-Driven Drug Discovery for Pancreatic Cancer",
        "Immunotherapy Response in Lung Cancer Patients", "Early Detection Biomarkers for Ovarian Cancer",
        "Personalized Radiation Therapy for Brain Tumors", "Epigenetic Modifications in Colon Cancer Progression",
        "Targeting Metabolism in Glioblastoma Multiforme", "Circulating Tumor DNA for Disease Monitoring",
        "Novel Therapies for Pediatric Leukemias", "Understanding Metastasis in Prostate Cancer"
    ];
    const institutes = [
        "Cancer Research Institute", "Global Oncology Center", "Biomedical Research Hub",
        "University Cancer Center", "National Health Institute"
    ];
    const accesses = ["Access restricted at present","Closed to access",
    "Open in response to specific calls","Open only through collaboration","Open to applicants"
    ];
    const positions = ["D", "E", "B", "C", "A"]
    const studiesData = [];
    for (let i = 1; i <= 50; i++) {
        const j = Math.floor(Math.random() * positions.length);
        const randomAccess = accesses[j]
        const randomAccessPos = positions[j]
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomInstitute = institutes[Math.floor(Math.random() * institutes.length)];
        const randomDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        studiesData.push({
            id: i,
            position: `${randomAccessPos}`,
            accessPhrase: `${randomAccess}`,
            studyTitle: `${randomTitle} (Study ${i})`,
            leadResearcherInstitute: `Dr. ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}. ${randomInstitute}`,
            dateAdded: randomDate.toISOString().split('T')[0], // YYYY-MM-DD
            dateStarted: randomDate.toISOString().split('T')[0] // YYYY-MM-DD
        });
    }
    return studiesData;
};

const INITIAL_STUDIES_DATA = generateMockStudies();

// --- StudiesSection Component ---

export const StudiesSection = () => {
    // State management for table data, search, sort, and the dev notes button
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeepSearch, setIsDeepSearch] = useState(false);
    const [isDevNotesHidden, setIsDevNotesHidden] = useState(true);
    const [sortConfig, setSortConfig] = useState({ column: 'dateAdded', direction: 'desc' });
    const [studies, setStudies] = useState(INITIAL_STUDIES_DATA);

    // Filter and sort the studies based on state changes (replaces logic in script.js)
    const filteredAndSortedStudies = useMemo(() => {
        let currentStudies = [...studies];

        // 1. Filtering (Simulates search logic from script.js)
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentStudies = currentStudies.filter(study =>
                study.studyTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
                (isDeepSearch && study.leadResearcherInstitute.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        // 2. Sorting (Simulates sorting logic from script.js)
        currentStudies.sort((a, b) => {
            const valA = a[sortConfig.column];
            const valB = b[sortConfig.column];

            if (valA < valB) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return currentStudies;
    }, [studies, searchTerm, isDeepSearch, sortConfig]);

    // Event handler for the search bar
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Event handler for table header click (sorting)
    const handleSort = (column) => {
        setSortConfig(prevConfig => ({
            column,
            direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // JSX helper to display the sort indicator
    const getSortIndicator = (column) => {
        if (sortConfig.column === column) {
            return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };


    // Define the style for a larger font size (as requested)
    const style = { fontSize: '1.2rem' };

    return (
        <div style={style}>
            <section className="studies-section">


                <div className="search-section">
                    <input
                        type="search"
                        id="search-bar"
                        placeholder="Search selected studies..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <p></p>
                    <input
                        type="checkbox"
                        id="deep_search"
                        checked={isDeepSearch}
                        onChange={(e) => setIsDeepSearch(e.target.checked)}
                    />
                    {/* htmlFor is used in JSX for label-input association */}
                    <label htmlFor="deep_search"> Deep Search <i> - may be slow</i></label><br />
                </div>

                <div className="studies-table-container">
                    <table className="studies-table">
                        <thead>
                            <tr>
                                {/* Table headers with click handlers for sorting */}
                                <th data-sort="accessPhrase" onClick={() => handleSort('position')}>
                                    Accessibility <span classNaßme="sort-indicator">{getSortIndicator('accessPhrase')}</span>
                                </th>
                                <th data-sort="studyTitle" onClick={() => handleSort('studyTitle')}>
                                    Study Title <span className="sort-indicator">{getSortIndicator('studyTitle')}</span>
                                </th>
                                <th data-sort="leadResearcherInstitute" onClick={() => handleSort('leadResearcherInstitute')}>
                                    Lead Researcher/Institute <span className="sort-indicator">{getSortIndicator('leadResearcherInstitute')}</span>
                                </th>
                                <th data-sort="dateAdded" onClick={() => handleSort('dateAdded')}>
                                    Updated <span className="sort-indicator">{getSortIndicator('dateAdded')}</span>
                                </th>
                                <th data-sort="dateStarted" onClick={() => handleSort('dateStarted')}>
                                    CRUK funding start-date <span className="sort-indicator">{getSortIndicator('dateStarted')}</span>
                                </th>

                            </tr>
                        </thead>
                        {/* Rendering the table body using React's map function */}
                        <tbody id="studies-table-body">
                            {filteredAndSortedStudies.map(study => (
                                <tr key={study.id}>
                                    <td>{study.accessPhrase}</td>
                                    <td>{study.studyTitle}</td>
                                    <td>{study.leadResearcherInstitute}</td>
                                    <td>{study.dateStarted}</td>
                                    <td>{study.dateAdded}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

import React, { useState, useMemo } from 'react';
// Import the compiled JSON from the data directory
import INITIAL_STUDIES_DATA from '../data/all_studies_without_erd.json';

const ICON_OPTS = [
    { url: "../assets/animal.webp", label: "Model Organism Study" },
    { url: "../assets/background.webp", label: "Background Information" },
    { url: "../assets/biobank.webp", label: "Samples Available" },
    { url: "../assets/invitro.webp", label: "In Vitro Study" },
    { url: "../assets/lab_results.webp", label: "Lab Results" },
    { url: "../assets/longitudinal.webp", label: "Longitudinal Study" },
    { url: "../assets/medical_imaging.webp", label: "Medical Imaging" },
    { url: "../assets/omics.webp", label: "Omics" },
    { url: "../assets/population.webp", label: "Patient Study" },
    { url: "../assets/treatments.webp", label: "Treatments" }
];

// --- SVG Icons Components ---
const HeartIcon = ({ filled, onClick }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" style={{ cursor: 'pointer', fill: filled ? '#dc3545' : 'none', stroke: filled ? '#dc3545' : '#555', strokeWidth: 2 }}>
        <title>{filled ? "Remove from Favourites" : "Add to Favourites"}</title>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

const CartIcon = ({ filled, onClick }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" style={{ cursor: 'pointer', fill: filled ? '#007bff' : 'none', stroke: filled ? '#007bff' : '#555', strokeWidth: 2 }}>
        <title>{filled ? "Remove from Cart" : "Add to Cart"}</title>
        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

export const StudiesSection = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [isDeepSearch, setIsDeepSearch] = useState(false);
    // FIX: Default column changed from 'modified' to 'dateAdded' to match the mapping
    const [sortConfig, setSortConfig] = useState({ column: 'dateAdded', direction: 'desc' });
    const [showSynopsis, setShowSynopsis] = useState(true);

    const [cart, setCart] = useState([]);
    const [favourites, setFavourites] = useState([]);

    //Add in a listener
    const [visibleIds, setVisibleIds] = React.useState(null);

    React.useEffect(() => {
        const handleFilterUpdate = (event) => {
            // Set the visible IDs from the event detail
            setVisibleIds(event.detail.studies);
        };

        // Listen for the signal
        window.addEventListener('cruk-filter-updated', handleFilterUpdate);

        // Clean up the listener if the component unmounts
        return () => window.removeEventListener('cruk-filter-updated', handleFilterUpdate);
    }, []);
    console.log("Studies received IDs:", visibleIds);
    // --- Data Processing ---
    const processedStudies = useMemo(() => {
        return INITIAL_STUDIES_DATA.map(dataset => {
            const accessFilter = dataset.datasetFilters?.find(f => f.id.startsWith("0_1_")) || {};
            const matchedIcons = (dataset.icons || []).map(iconLabel =>
                ICON_OPTS.find(opt => opt.label === iconLabel)
            ).filter(Boolean);

            return {
                id: dataset.identifier,
                position: accessFilter.id || "Z",
                accessPhrase: accessFilter.label || "Unknown",
                studyTitle: dataset.summary?.title || "Untitled Study",
                leadResearcherInstitute: `${dataset.project?.leadResearcher || ''}, ${dataset.project?.leadResearchInstitute || ''}`,
                populationSize: dataset.summary?.populationSize || 0,
                dateAdded: dataset.modified?.split('T')[0] || "",
                dateStarted: dataset.project?.projectStartDate || "",
                earliestData: dataset.provenance?.temporal?.startDate || "",
                studyIcons: matchedIcons,
                synopsis: dataset.summary?.abstract || "No synopsis available."
            };
        });
    }, []);

    const filteredAndSortedStudies = useMemo(() => {
        let currentStudies = [...processedStudies];

        // 1. Filtering
        if (searchTerm && searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase().trim();
            currentStudies = currentStudies.filter(study => {
                const titleMatch = study.studyTitle.toLowerCase().includes(term);
                const researcherMatch = study.leadResearcherInstitute.toLowerCase().includes(term);
                const accessMatch = study.accessPhrase.toLowerCase().includes(term);

                if (isDeepSearch) {
                    const synopsisMatch = study.synopsis.toLowerCase().includes(term);
                    return titleMatch || researcherMatch || accessMatch || synopsisMatch;
                }
                return titleMatch || researcherMatch || accessMatch;
            });
        }

        // 2. Sorting
        currentStudies.sort((a, b) => {
            if (sortConfig.column === 'favourite') {
                const isFavA = favourites.includes(a.id) ? 1 : 0;
                const isFavB = favourites.includes(b.id) ? 1 : 0;
                return sortConfig.direction === 'desc' ? isFavB - isFavA : isFavA - isFavB;
            }

            const valA = a[sortConfig.column];
            const valB = b[sortConfig.column];

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return currentStudies;
    }, [processedStudies, searchTerm, isDeepSearch, sortConfig, favourites]);

    // Helpers
    const toggleFavourite = (id) => setFavourites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    const toggleCart = (study) => setCart(prev => prev.find(item => item.id === study.id) ? prev.filter(item => item.id !== study.id) : [...prev, study]);
    const handleSort = (column) => setSortConfig(prev => ({ column, direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc' }));
    const getSortIndicator = (column) => sortConfig.column === column ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : '';

    return (
        <div style={{ fontSize: '1.3rem' }}>
            <style>{`
                .icon-container { position: relative; display: inline-flex; justify-content: center; align-items: center; z-index: 1; }
                .icon-container:hover { z-index: 9999; }
                .custom-tooltip { visibility: hidden; background-color: #0056b3; color: #ffffff; text-align: center; padding: 6px 12px; border-radius: 6px; position: absolute; z-index: 10000; bottom: 110%; left: 50%; transform: translateX(-50%); font-size: 0.9rem; white-space: nowrap; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
                .icon-container:hover .custom-tooltip { visibility: visible; opacity: 1; }
                .studies-table { width: 100%; border-collapse: collapse; }
                .studies-table th { padding: 12px; text-align: left; background-color: #e9ecef; cursor: pointer; border-bottom: 2px solid #ccc; }
                .study-title-row { background-color: #fff; border-top: 2px solid #888; }
                .study-data-row { background-color: #fcfcfc; }
                .synopsis-row td { background-color: #f8f9fa; color: #555; font-style: italic; padding: 10px 20px; border-bottom: 1px solid #ddd; font-size: 1.1rem; }
                .controls-container { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; margin-bottom: 20px; background: #f1f1f1; padding: 15px; border-radius: 8px; }
                .study-title-link { font-size: 1.4rem; font-weight: bold; margin-right: 20px; color: #0056b3; text-decoration: none; }
                .clear-btn { padding: 8px 12px; font-size: 1rem; cursor: pointer; background: #6c757d; color: white; border: none; border-radius: 4px; }
            `}</style>

            <section className="studies-section">
                <h2 className="p-4 text-3xl font-bold text-[var(--cruk-blue)]">Studies</h2>

                <div className="controls-container">
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Search studies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px', fontSize: '1.1rem', width: '300px' }}
                        />
                        {searchTerm && <button className="clear-btn" onClick={() => setSearchTerm('')}>Clear</button>}
                    </div>

                    <div className="icon-container">
                        <input type="checkbox" id="deep_search" checked={isDeepSearch} onChange={(e) => setIsDeepSearch(e.target.checked)} style={{ transform: "scale(1.5)", marginRight: "10px" }} />
                        <label htmlFor="deep_search">Deep Search</label>
                        <span className="custom-tooltip">Searches abstract/synopsis</span>
                    </div>

                    <div>
                        <label>Sort by: </label>
                        <select onChange={(e) => handleSort(e.target.value)} value={sortConfig.column} style={{ padding: '8px' }}>
                            <option value="favourite">Favourites</option>
                            <option value="dateAdded">Updated Date</option>
                            <option value="studyTitle">Study Title</option>
                            <option value="populationSize">Population Size</option>
                            <option value="position">Accessibility</option>
                        </select>
                    </div>

                    <button onClick={() => setShowSynopsis(!showSynopsis)} style={{ background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', textDecoration: 'underline' }}>
                        {showSynopsis ? "Hide Synopses" : "Show Synopses"}
                    </button>
                </div>

                <div className="studies-table-container">
                    <table className="studies-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('leadResearcherInstitute')}>Lead Researcher {getSortIndicator('leadResearcherInstitute')}</th>
                                <th onClick={() => handleSort('populationSize')}>Pop. Size {getSortIndicator('populationSize')}</th>
                                <th onClick={() => handleSort('position')}>Accessibility {getSortIndicator('position')}</th>
                                <th onClick={() => handleSort('earliestData')}>Earliest Data {getSortIndicator('earliestData')}</th>
                                <th onClick={() => handleSort('dateStarted')}>Start Date {getSortIndicator('dateStarted')}</th>
                                <th onClick={() => handleSort('dateAdded')}>Updated {getSortIndicator('dateAdded')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedStudies.map(study => (
                                <React.Fragment key={study.id}>
                                    <tr className="study-title-row">
                                        <td colSpan="6" style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <HeartIcon filled={favourites.includes(study.id)} onClick={() => toggleFavourite(study.id)} />
                                                <CartIcon filled={cart.some(c => c.id === study.id)} onClick={() => toggleCart(study)} />
                                                <a href="#" className="study-title-link">{study.studyTitle}</a>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {study.studyIcons.map((icon, idx) => (
                                                        <div key={idx} className="icon-container">
                                                            <img src={icon.url} alt={icon.label} style={{ height: '1.5em' }} />
                                                            <span className="custom-tooltip">{icon.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="study-data-row">
                                        <td>{study.leadResearcherInstitute}</td>
                                        <td>{study.populationSize.toLocaleString()}</td>
                                        <td>{study.accessPhrase}</td>
                                        <td>{study.earliestData}</td>
                                        <td>{study.dateStarted}</td>
                                        <td>{study.dateAdded}</td>
                                    </tr>
                                    {showSynopsis && (
                                        <tr className="synopsis-row">
                                            <td colSpan="6"><strong>Synopsis: </strong>{study.synopsis}</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
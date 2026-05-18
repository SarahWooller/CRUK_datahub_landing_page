import React, { useState, useMemo, useEffect } from 'react';

export const ProjectsSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ column: 'projectGrantStartDate', direction: 'desc' });
    const [grants, setGrants] = useState([]);
    const [showScope, setShowScope] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://127.0.0.1:8000/projects/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
                });
                if (!response.ok) throw new Error("Failed to fetch database records");
                const data = await response.json();
                setGrants(data);
            } catch (error) {
                console.error("Error loading from database:", error);
            }
        };
        fetchProjects();
    }, []);

    const filteredAndSortedGrants = useMemo(() => {
        let currentGrants = [...grants];

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentGrants = currentGrants.filter(grant =>
                (grant.projectGrantName && grant.projectGrantName.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (grant.leadResearcher && grant.leadResearcher.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (grant.leadResearchInstitute && grant.leadResearchInstitute.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (grant.projectGrantScope && grant.projectGrantScope.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        currentGrants.sort((a, b) => {
            const valA = a[sortConfig.column] || '';
            const valB = b[sortConfig.column] || '';

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return currentGrants;
    }, [grants, searchTerm, sortConfig]);

    const handleSort = (column) => {
        setSortConfig(prevConfig => ({
            column,
            direction: prevConfig.column === column && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIndicator = (column) => {
        if (sortConfig.column === column) {
            return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };

    return (
        <div style={{ fontSize: '1.3rem', padding: '20px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <style>{`
                .dashboard-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    border: 1px solid #e5e7eb;
                    overflow: hidden;
                }
                .dashboard-header {
                    padding: 30px;
                    border-bottom: 1px solid #e5e7eb;
                    background-color: #ffffff;
                }
                .dashboard-title {
                    font-size: 2rem;
                    color: #0056b3;
                    margin: 0 0 10px 0;
                    font-weight: bold;
                }
                .dashboard-subtitle {
                    color: #6b7280;
                    font-size: 1.1rem;
                    margin: 0 0 20px 0;
                }
                .controls-wrapper {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                .search-input {
                    padding: 12px 16px;
                    font-size: 1.1rem;
                    width: 400px;
                    max-width: 100%;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    transition: border-color 0.2s;
                }
                .search-input:focus {
                    outline: none;
                    border-color: #0056b3;
                    box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
                }
                .toggle-btn {
                    background-color: #f3f4f6;
                    border: 1px solid #d1d5db;
                    color: #374151;
                    font-size: 1.1rem;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 10px 20px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .toggle-btn:hover {
                    background-color: #e5e7eb;
                    color: #0056b3;
                }
                .table-container {
                    overflow-x: auto;
                    padding: 0;
                }
                .studies-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .studies-table th {
                    white-space: nowrap;
                    padding: 16px 20px;
                    text-align: left;
                    background-color: #f8f9fa;
                    color: #ffffff;
                    font-weight: 600;
                    cursor: pointer;
                    border-bottom: 2px solid #e5e7eb;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    transition: background-color 0.2s;
                }
                .studies-table th:hover {
                    background-color: #f3f4f6;
                }
                .studies-table td {
                    padding: 14px 20px;
                    color: #374151;
                }
                .study-title-row {
                    background-color: #fff;
                }
                .study-title-text {
                    font-size: 1.3rem;
                    font-weight: bold;
                }
                .study-title-link {
                    color: #0056b3;
                    text-decoration: none;
                    transition: color 0.2s ease-in-out;
                }
                .study-title-link:hover {
                    color: #003060;
                    text-decoration: underline;
                }
                .study-data-row {
                    background-color: #fff;
                    border-bottom: 1px solid #f3f4f6;
                }
                .synopsis-row td {
                    background-color: #fafafa;
                    color: #4b5563;
                    padding: 14px 20px 24px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    line-height: 1.6;
                }
                .scope-label {
                    font-weight: 600;
                    color: #0056b3;
                    margin-right: 8px;
                }
            `}</style>

            <div className="dashboard-container">
                <div className="dashboard-header">

                    <div className="controls-wrapper">
                        <input
                            type="search"
                            placeholder="Search projects, researchers, or institutes..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="toggle-btn"
                            onClick={() => setShowScope(!showScope)}
                        >
                            {showScope ? "Collapse All Scopes" : "Expand All Scopes"}
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="studies-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('leadResearcher')}>
                                    Lead Researcher <span className="sort-indicator">{getSortIndicator('leadResearcher')}</span>
                                </th>
                                <th onClick={() => handleSort('leadResearchInstitute')}>
                                    Institute <span className="sort-indicator">{getSortIndicator('leadResearchInstitute')}</span>
                                </th>
                                <th onClick={() => handleSort('projectGrantStartDate')}>
                                    Start Date <span className="sort-indicator">{getSortIndicator('projectGrantStartDate')}</span>
                                </th>
                                <th onClick={() => handleSort('projectGrantEndDate')}>
                                    End Date <span className="sort-indicator">{getSortIndicator('projectGrantEndDate')}</span>
                                </th>
                                <th onClick={() => handleSort('grantNumbers')}>
                                    Grant Number <span className="sort-indicator">{getSortIndicator('grantNumbers')}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedGrants.map((grant, index) => (
                                <React.Fragment key={grant.pid || index}>

                                    <tr className="study-title-row">
                                        <td colSpan="5" style={{ paddingTop: '24px', paddingBottom: '8px' }}>
                                            <span className="study-title-text">
                                                <a href={`project_meta.html?id=${grant.pid}`} className="study-title-link">
                                                    {grant.projectGrantName}
                                                </a>
                                            </span>
                                        </td>
                                    </tr>

                                    <tr className="study-data-row">
                                        <td>{grant.leadResearcher}</td>
                                        <td>{grant.leadResearchInstitute}</td>
                                        <td>{grant.projectGrantStartDate}</td>
                                        <td>{grant.projectGrantEndDate}</td>
                                        <td>{grant.grantNumbers}</td>
                                    </tr>

                                    {showScope && (
                                        <tr className="synopsis-row">
                                            <td colSpan="5">
                                                {grant.projectGrantScope}
                                            </td>
                                        </tr>
                                    )}

                                </React.Fragment>
                            ))}
                            {grants.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                        No data found. Ensure your JSON files are in the correct directory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import TargetSelector from './TargetSelector';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const PublicationUpload = () => {
    const teamId = parseInt(localStorage.getItem('activeTeamId'), 10) || parseInt(localStorage.getItem('teamId'), 10);
    const token = localStorage.getItem('token');

    const [datasets, setDatasets] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedTarget, setSelectedTarget] = useState(null);

    const [currentDoi, setCurrentDoi] = useState('');
    const [dois, setDois] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [resetCountdown, setResetCountdown] = useState(null);

    // Search state
    const [searchTitle, setSearchTitle] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (isNaN(teamId) || !token) return;

            try {
                const dsRes = await fetch(`${API_BASE_URL}/datasets/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dsData = dsRes.ok ? await dsRes.json() : [];
                const fetchedDatasets = dsData.filter(d => d.team_id === teamId);

                const projRes = await fetch(`${API_BASE_URL}/projects/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const projData = projRes.ok ? await projRes.json() : [];
                const fetchedProjects = projData.filter(p => p.team_id === teamId);

                const sortAlpha = (a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || '');
                setDatasets(fetchedDatasets.sort(sortAlpha));
                setProjects(fetchedProjects.sort(sortAlpha));
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            }
        };
        fetchData();
    }, [teamId, token]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && currentDoi.trim().length > 0) {
            setDois([...dois, { value: currentDoi.trim(), status: 'pending' }]);
            setCurrentDoi('');
        }
    };

    const removeDoi = (index) => {
        setDois(dois.filter((_, i) => i !== index));
    };

    const updateDoi = (index, newValue) => {
        const updated = [...dois];
        updated[index].value = newValue;
        updated[index].status = 'pending';
        setDois(updated);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSearching(true);
        setSearchError(null);
        setSearchResults([]);
        setHasSearched(false);

        try {
            const url = `https://api.crossref.org/works?query=${encodeURIComponent(searchTitle)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch data from Crossref API');
            }

            const data = await response.json();
            const items = data.message.items;

            const filteredItems = items
                .filter(item => {
                    if (!searchKeyword.trim()) return true;
                    const itemJsonString = JSON.stringify(item).toLowerCase();
                    return itemJsonString.includes(searchKeyword.toLowerCase());
                })
                .map(item => ({
                    doi: item.DOI,
                    title: item.title && item.title.length > 0 ? item.title[0] : 'No Title Provided',
                    abstract: item.abstract || 'No abstract provided for this publication.'
                }));

            setSearchResults(filteredItems);
            setHasSearched(true);
        } catch (err) {
            setSearchError(err.message);
        } finally {
            setIsSearching(false);
        }
    };

    const toggleSearchDoi = (doi) => {
        const index = dois.findIndex(d => d.value === doi);
        if (index >= 0) {
            removeDoi(index);
        } else {
            setDois([...dois, { value: doi, status: 'pending' }]);
        }
    };

    const isDoiSelected = (doi) => {
        return dois.some(d => d.value === doi);
    };

    const handleSubmit = async () => {
        if (selectedTarget === null) {
            setFeedback({ message: 'Please select a dataset or project first.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setFeedback({ message: 'Processing publications...', type: 'info' });

        let allSuccess = true;
        const updatedDois = [...dois];

        for (let i = 0; i < updatedDois.length; i++) {
            const doiObj = updatedDois[i];

            if (doiObj.status === 'success') continue;

            try {
                // 1. Create publication
                const pubRes = await fetch(`${API_BASE_URL}/publications/from-doi`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ doi: doiObj.value, team_id: teamId })
                });

                if (pubRes.ok === false) throw new Error('Invalid DOI');

                const pubData = await pubRes.json();
                const pubId = pubData.id;

                // 2. Link publication
                const linkPath = selectedTarget.type === 'dataset'
                    ? `/publications/${pubId}/datasets/${selectedTarget.id}`
                    : `/publications/${pubId}/projects/${selectedTarget.id}`;

                const linkRes = await fetch(`${API_BASE_URL}${linkPath}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (linkRes.ok === false) throw new Error('Linking failed');

                updatedDois[i].status = 'success';

            } catch (error) {
                updatedDois[i].status = 'error';
                allSuccess = false;
            }
        }

        setDois(updatedDois);

        if (allSuccess === true) {
            setFeedback({ message: 'All publications created and linked successfully. Resetting form.', type: 'success' });
            startResetTimer();
        } else {
            setFeedback({ message: 'Some DOIs encountered errors. Please correct them and try again.', type: 'error' });
            setIsSubmitting(false);
        }
    };

    const startResetTimer = () => {
        let seconds = 5;
        setResetCountdown(seconds);
        const interval = setInterval(() => {
            seconds -= 1;
            setResetCountdown(seconds);
            if (seconds === 0) {
                clearInterval(interval);
                resetForm();
            }
        }, 1000);
    };

    const resetForm = () => {
        setDois([]);
        setSelectedTarget(null);
        setFeedback({ message: '', type: '' });
        setResetCountdown(null);
        setIsSubmitting(false);
        setSearchTitle('');
        setSearchKeyword('');
        setSearchResults([]);
        setHasSearched(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 mt-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 border-b pb-4">Upload Publications</h2>

            <TargetSelector
                datasets={datasets}
                projects={projects}
                selectedTarget={selectedTarget}
                onSelectionChange={setSelectedTarget}
                disabled={isSubmitting}
            />

            <div className="grid grid-cols-1 gap-8 mt-6">

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">2. Find or Enter DOIs</h3>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add DOI Manually</label>
                        <input
                            type="text"
                            placeholder="Type a DOI and press Enter..."
                            value={currentDoi}
                            onChange={(e) => setCurrentDoi(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isSubmitting || selectedTarget === null}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
                        />
                    </div>

                    <div className="border-t border-gray-300 my-6"></div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Or Search Crossref</h4>
                        <form onSubmit={handleSearch} className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dataset Title</label>
                                <input
                                    type="text"
                                    value={searchTitle}
                                    onChange={(e) => setSearchTitle(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Keyword (Optional)</label>
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSearching || isSubmitting}
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {isSearching ? 'Searching...' : 'Search Publications'}
                            </button>
                        </form>

                        {searchError && (
                            <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
                                {searchError}
                            </div>
                        )}

                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {searchResults.map((pub) => (
                                <div key={pub.doi} className="flex items-start p-4 border border-gray-200 bg-white rounded-md hover:bg-gray-50 transition-colors">
                                    <div className="flex-shrink-0 pt-1 mr-4">
                                        <input
                                            type="checkbox"
                                            checked={isDoiSelected(pub.doi)}
                                            onChange={() => toggleSearchDoi(pub.doi)}
                                            disabled={isSubmitting || selectedTarget === null}
                                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-indigo-600 mb-1">
                                            DOI: <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-800">{pub.doi}</a>
                                        </p>
                                        <p className="text-base font-bold text-gray-900 mb-2">
                                            {pub.title}
                                        </p>
                                        <div
                                            className="text-sm text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: pub.abstract }}
                                        />
                                    </div>
                                </div>
                            ))}

                            {searchResults.length === 0 && !isSearching && !searchError && hasSearched && (
                                <p className="text-gray-500 italic">No publications found. Try adjusting your search criteria.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">3. Upload Queue</h3>

                    {dois.length === 0 ? (
                        <p className="text-gray-500 italic mb-6">No DOIs added yet. Enter manually or select from search.</p>
                    ) : (
                        <ul className="space-y-3 mb-6">
                            {dois.map((doi, index) => (
                                <li key={index} className="flex items-center space-x-3 bg-white p-2 rounded-md border border-gray-200 shadow-sm">
                                    <div className="flex-grow flex items-center space-x-3">
                                        <input
                                            type="text"
                                            value={doi.value}
                                            onChange={(e) => updateDoi(index, e.target.value)}
                                            disabled={isSubmitting || doi.status === 'success'}
                                            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 ${
                                                doi.status === 'error' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                        />
                                        <a
                                            href={`https://doi.org/${doi.value}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-indigo-600 hover:underline whitespace-nowrap"
                                        >
                                            View
                                        </a>
                                    </div>
                                    <div className="w-20 text-center font-medium text-sm">
                                        {doi.status === 'error' && <span className="text-red-600">Failed</span>}
                                        {doi.status === 'success' && <span className="text-green-600">Linked</span>}
                                        {doi.status === 'pending' && <span className="text-gray-400">Pending</span>}
                                    </div>
                                    <button
                                        onClick={() => removeDoi(index)}
                                        disabled={isSubmitting}
                                        className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || dois.length === 0 || selectedTarget === null}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow"
                    >
                        {isSubmitting ? 'Processing DOIs...' : 'Submit Publications'}
                    </button>

                    {feedback.message && (
                        <div className={`mt-4 p-4 rounded-md font-medium border ${
                            feedback.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
                            feedback.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
                            'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                            {feedback.message}
                        </div>
                    )}

                    {resetCountdown !== null && (
                        <div className="mt-2 text-sm text-gray-500 font-medium text-center">
                            Resetting form in {resetCountdown} seconds...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicationUpload;
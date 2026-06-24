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
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 mt-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 border-b pb-4">Upload Publications</h2>

            <TargetSelector
                datasets={datasets}
                projects={projects}
                selectedTarget={selectedTarget}
                onSelectionChange={setSelectedTarget}
                disabled={isSubmitting}
            />

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">2. Enter DOIs</h3>
                <input
                    type="text"
                    placeholder="Type a DOI and press Enter..."
                    value={currentDoi}
                    onChange={(e) => setCurrentDoi(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSubmitting || selectedTarget === null}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed mb-4 shadow-sm"
                />

                {dois.length > 0 && (
                    <ul className="space-y-3 mb-6">
                        {dois.map((doi, index) => (
                            <li key={index} className="flex items-center space-x-3 bg-white p-2 rounded-md border border-gray-200 shadow-sm">
                                <input
                                    type="text"
                                    value={doi.value}
                                    onChange={(e) => updateDoi(index, e.target.value)}
                                    disabled={isSubmitting || doi.status === 'success'}
                                    className={`flex-grow p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 ${
                                        doi.status === 'error' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
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
    );
};

export default PublicationUpload;
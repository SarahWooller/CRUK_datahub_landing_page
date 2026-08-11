import React, { useState, useEffect } from 'react';

const MIDDLELAYER_URL = import.meta.env.VITE_MIDDLELAYER_URL || "http://localhost:8002";

export const ErrorLogsTab = ({ token }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // View state
    const [expandedLogId, setExpandedLogId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All'); 
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
    
    // Edit state
    const [editStatus, setEditStatus] = useState({});
    const [editAssignee, setEditAssignee] = useState({});
    const [editNotes, setEditNotes] = useState({});

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${MIDDLELAYER_URL}/logs/errors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch logs');
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (msg, isError = false) => {
        if (isError) setError(msg);
        else setSuccess(msg);
        setTimeout(() => { setError(''); setSuccess(''); }, 4000);
    };

    const handleUpdateLog = async (logId) => {
        const payload = {};
        if (editStatus[logId] !== undefined) payload.status = editStatus[logId];
        if (editAssignee[logId] !== undefined) payload.assigned_to = editAssignee[logId];
        if (editNotes[logId] !== undefined) payload.resolution_notes = editNotes[logId];

        if (Object.keys(payload).length === 0) return toggleExpand(logId);

        try {
            const res = await fetch(`${MIDDLELAYER_URL}/logs/errors/${logId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to update log');
            
            showMessage('Error log updated successfully!');
            fetchLogs();
            toggleExpand(logId);
        } catch (err) {
            showMessage(err.message, true);
        }
    };

    const handleDeleteLog = async (logId) => {
        if (!window.confirm("Are you sure you want to permanently delete this error log?")) return;
        try {
            const res = await fetch(`${MIDDLELAYER_URL}/logs/errors/${logId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete log');
            
            showMessage('Error log deleted.');
            fetchLogs();
        } catch (err) {
            showMessage(err.message, true);
        }
    };

    const toggleExpand = (id) => {
        setExpandedLogId(expandedLogId === id ? null : id);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredLogs = logs.filter(log => {
        if (filterStatus === 'All') return true;
        return log.status === filterStatus;
    });

    const sortedLogs = [...filteredLogs].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'Open': return 'bg-red-100 text-red-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Ignored': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <span className="ml-1 text-gray-300">↕</span>;
        return sortConfig.direction === 'asc' ? <span className="ml-1 text-gray-700">↑</span> : <span className="ml-1 text-gray-700">↓</span>;
    };

    if (loading) return <div className="text-center py-10 text-gray-500">Loading error logs...</div>;

    return (
        <div>
            {error && <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}
            {success && <div className="mb-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded">{success}</div>}

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Error Logs Dashboard</h3>
                <div className="flex gap-4 items-center">
                    <label className="font-medium text-gray-700 text-sm">Filter Status:</label>
                    <select 
                        value={filterStatus} 
                        onChange={e => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded p-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="All">All Logs</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Ignored">Ignored</option>
                    </select>
                    <button onClick={fetchLogs} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border border-gray-300">
                        Refresh
                    </button>
                </div>
            </div>

            {sortedLogs.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 border rounded-lg text-gray-500">
                    No errors found matching your filter. Excellent!
                </div>
            ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th onClick={() => handleSort('id')} className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID <SortIcon column="id" />
                                </th>
                                <th onClick={() => handleSort('timestamp')} className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp <SortIcon column="timestamp" />
                                </th>
                                <th onClick={() => handleSort('service_name')} className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service <SortIcon column="service_name" />
                                </th>
                                <th onClick={() => handleSort('message')} className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Message <SortIcon column="message" />
                                </th>
                                <th onClick={() => handleSort('status')} className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status <SortIcon column="status" />
                                </th>
                                <th onClick={() => handleSort('assigned_to')} className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Assignee <SortIcon column="assigned_to" />
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Triage
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedLogs.map(log => {
                                const isExpanded = expandedLogId === log.id;
                                const currentStatus = editStatus[log.id] || log.status;
                                const currentAssignee = editAssignee[log.id] !== undefined ? editAssignee[log.id] : (log.assigned_to || '');
                                const currentNotes = editNotes[log.id] !== undefined ? editNotes[log.id] : (log.resolution_notes || '');

                                return (
                                    <React.Fragment key={log.id}>
                                        <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-blue-50' : ''}`}>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-500 whitespace-nowrap">
                                                #{log.id}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {log.service_name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs" title={log.message}>
                                                {log.message || 'Unknown Error'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[100px]" title={log.assigned_to}>
                                                {log.assigned_to || <span className="text-gray-400 italic">Unassigned</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button 
                                                    onClick={() => toggleExpand(log.id)} 
                                                    className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                                                    title="Triage this error"
                                                >
                                                    <svg xmlns="http://www.3w.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-blue-50 border-b border-blue-100">
                                                <td colSpan="7" className="p-4">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        {/* Left Column: Trace */}
                                                        <div>
                                                            <div className="mb-2 flex justify-between items-center">
                                                                <h4 className="text-sm font-bold text-gray-800">Error Trace / Details</h4>
                                                                <span className="text-xs text-gray-500 font-mono">Correlation ID: {log.correlation_id}</span>
                                                            </div>
                                                            <div className="bg-gray-100 border border-gray-300 text-gray-900 p-3 rounded-md text-xs font-mono overflow-auto max-h-64 shadow-inner">
                                                                <pre className="whitespace-pre-wrap">{log.stack_trace || log.message || "No stack trace provided."}</pre>
                                                            </div>
                                                        </div>

                                                        {/* Right Column: Triage Actions */}
                                                        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                                            <h4 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Triage Actions</h4>
                                                            
                                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                                                    <select 
                                                                        value={currentStatus}
                                                                        onChange={(e) => setEditStatus({ ...editStatus, [log.id]: e.target.value })}
                                                                        className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-1 focus:ring-blue-500 bg-white"
                                                                    >
                                                                        <option value="Open">Open</option>
                                                                        <option value="In Progress">In Progress</option>
                                                                        <option value="Resolved">Resolved</option>
                                                                        <option value="Ignored">Ignored</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Assign To</label>
                                                                    <input 
                                                                        type="text" 
                                                                        placeholder="Name or Email"
                                                                        value={currentAssignee}
                                                                        onChange={(e) => setEditAssignee({ ...editAssignee, [log.id]: e.target.value })}
                                                                        className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-1 focus:ring-blue-500"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">Resolution Notes</label>
                                                                <textarea 
                                                                    rows="2"
                                                                    placeholder="How was this fixed? Any context?"
                                                                    value={currentNotes}
                                                                    onChange={(e) => setEditNotes({ ...editNotes, [log.id]: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-1 focus:ring-blue-500"
                                                                ></textarea>
                                                            </div>

                                                            <div className="flex justify-between items-center mt-4">
                                                                <button 
                                                                    onClick={() => handleDeleteLog(log.id)}
                                                                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                                                                >
                                                                    Delete Log
                                                                </button>
                                                                <div className="space-x-2">
                                                                    <button 
                                                                        onClick={() => toggleExpand(log.id)}
                                                                        className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 font-medium"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleUpdateLog(log.id)}
                                                                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-sm"
                                                                    >
                                                                        Save Changes
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

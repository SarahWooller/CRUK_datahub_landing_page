import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const InvitationsModal = ({ userName }) => {
    const [invitations, setInvitations] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const [step, setStep] = useState('list'); // list, selectTeam
    const [updatedTeams, setUpdatedTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');

    useEffect(() => {
        if (!userName) return;
        fetchInvitations();
    }, [userName]);

    const fetchInvitations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`${API_BASE_URL}/teams/invitations/pending`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (res.ok && data.length > 0) {
                setInvitations(data);
                setIsOpen(true);
            }
        } catch (err) {
            console.error("Failed to fetch invitations:", err);
        }
    };

    const handleAction = async (invitationId, action) => {
        setStatus('loading');
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/teams/invitations/${invitationId}/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.detail || `Failed to ${action} invitation`);

            // Remove the handled invitation from the list
            const remaining = invitations.filter(inv => inv.id !== invitationId);
            setInvitations(remaining);
            
            if (action === 'accept') {
                // Backend returned updated teams
                const newTeams = data.teams || [];
                localStorage.setItem('userTeams', JSON.stringify(newTeams));
                setUpdatedTeams(newTeams);
                
                // Show the team selection step
                setStep('selectTeam');
                setStatus('idle');
            } else {
                if (remaining.length === 0) {
                    setIsOpen(false);
                } else {
                    setStatus('idle');
                }
            }
        } catch (err) {
            setStatus('error');
            setMessage(err.message);
        }
    };

    const handleTeamSelection = () => {
        if (!selectedTeamId) return;
        localStorage.setItem('activeTeamId', selectedTeamId);
        window.location.reload();
    };

    if (!isOpen || (invitations.length === 0 && step === 'list')) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-[500px] max-w-full animate-fade-in">
                
                {step === 'list' && (
                    <>
                        <h2 className="text-2xl font-bold mb-2 text-[var(--cruk-darkblue)]">Team Invitations</h2>
                        <p className="text-gray-600 mb-6">You have been invited to join the following teams:</p>
                        
                        {status === 'error' && <p className="text-sm font-bold text-red-600 mb-4">{message}</p>}
                        
                        <div className="space-y-4">
                            {invitations.map(invitation => (
                                <div key={invitation.id} className="border border-gray-200 rounded p-4 flex justify-between items-center bg-gray-50">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{invitation.team ? invitation.team.name : `Team #${invitation.team_id}`}</h3>
                                        <p className="text-sm text-gray-500">Sent to: {invitation.email}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button 
                                            onClick={() => handleAction(invitation.id, 'reject')}
                                            className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                                            disabled={status === 'loading'}
                                        >
                                            Decline
                                        </button>
                                        <button 
                                            onClick={() => handleAction(invitation.id, 'accept')}
                                            className="btn px-3 py-1 text-sm font-medium disabled:opacity-50"
                                            disabled={status === 'loading'}
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                            <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium">Decide Later</button>
                        </div>
                    </>
                )}

                {step === 'selectTeam' && (
                    <>
                        <h2 className="text-2xl font-bold mb-6 text-[var(--cruk-darkblue)]">Select Active Team</h2>
                        <p className="mb-4 text-gray-600">Please select your active team space to continue.</p>
                        <select 
                            className="w-full p-2 border border-gray-300 rounded mb-6 focus:outline-none focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]"
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                        >
                            <option value="" disabled>Select a team</option>
                            {updatedTeams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleTeamSelection}
                            className="w-full btn py-2 px-4 mb-2 disabled:opacity-50"
                            disabled={!selectedTeamId}
                        >
                            Continue
                        </button>
                        {invitations.length > 0 && (
                            <button 
                                onClick={() => setStep('list')}
                                className="w-full py-2 px-4 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium"
                            >
                                Back to Invitations
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

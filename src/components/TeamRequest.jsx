import React, { useState, useRef } from 'react';
const MIDDLELAYER_URL = import.meta.env.VITE_MIDDLELAYER_URL || "http://localhost:8002";

const TeamRequest = () => {
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState(null);
    const formRef = useRef(null);

    React.useEffect(() => {
        setUserName(localStorage.getItem('userName'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const formData = new FormData(formRef.current);

        try {
            const response = await fetch(`${MIDDLELAYER_URL}/team_requests/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.detail || 'Failed to submit request.');
            }

            setStatus('success');
            setMessage('Your team request has been successfully submitted! We will review it shortly.');
            formRef.current.reset();
        } catch (err) {
            setStatus('error');
            setMessage(err.message || 'An error occurred. Please try again.');
        }
    };

    if (!userName) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 mb-10 text-center">
                <h1 className="text-2xl font-bold mb-4 text-[var(--cruk-darkblue)]">Sign in Required</h1>
                <p className="text-gray-600 mb-6">You must be logged in to request a new team space.</p>
                <a href="./index.html" className="btn inline-block py-2 px-4">Return Home to Sign In</a>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 mb-10">
            <h1 className="text-2xl font-bold mb-2 text-[var(--cruk-darkblue)]">Request a New Team</h1>
            <div className="text-gray-500 mb-6 font-medium bg-gray-50 p-2 rounded inline-block">Requested by: {userName}</div>
            
            <p className="mb-6 text-gray-600">Please fill out the form below to request a new team space on the CRUK Datahub.</p>
            
            {status === 'success' && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded font-medium">
                    {message}
                </div>
            )}
            
            {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded font-medium">
                    {message}
                </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field - Invisible to real users, catches dumb bots */}
                <div style={{ display: 'none' }}>
                    <label>Leave this empty if you are human</label>
                    <input type="text" name="website_url" tabIndex="-1" autoComplete="off" />
                </div>
                
                <input type="hidden" name="user_name" value={userName || ""} />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" required className="w-full p-2 border border-gray-300 rounded focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name <span className="text-red-500">*</span></label>
                    <input type="text" name="team_name" required className="w-full p-2 border border-gray-300 rounded focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HDR Gateway Email <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input type="email" name="hdr_gateway_email" className="w-full p-2 border border-gray-300 rounded focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Introduction <span className="text-red-500">*</span></label>
                    <textarea name="team_introduction" rows="4" className="w-full p-2 border border-gray-300 rounded focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request <span className="text-red-500">*</span></label>
                    <textarea name="reason" required rows="4" className="w-full p-2 border border-gray-300 rounded focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input type="url" name="team_url" className="w-full p-2 border border-gray-300 rounded focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Access Request URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input type="url" name="data_access_request_url" className="w-full p-2 border border-gray-300 rounded focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Logo <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <p className="text-xs text-gray-500 mb-2">Please upload a valid PNG file.</p>
                    <input type="file" name="team_logo" accept="image/png" className="w-full text-gray-700 border border-gray-300 rounded p-1" />
                </div>

                <div className="pt-4 border-t border-gray-200 mt-6">
                    <button type="submit" disabled={status === 'loading'} className="btn w-full py-3 text-lg font-bold">
                        {status === 'loading' ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TeamRequest;

import React, { useState } from 'react';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const SignInModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch(`${API_BASE_URL}/token`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || 'Login failed');

            localStorage.setItem('userId', data.user.id.toString());
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userName', data.user.name);
            if (data.user.teams && data.user.teams.length > 0) {
                localStorage.setItem('teamId', data.user.teams[0].id);
                localStorage.setItem('activeTeamId', data.user.teams[0].id);
            } else {
                localStorage.removeItem('teamId');
            }

            setStatus('success');
            setMessage('Successfully logged in! Updating...');
            
            // Wait 1.5 seconds so user can see success message, then close
            setTimeout(() => {
                onLoginSuccess(data.user);
                // Also reset state for next time
                setEmail('');
                setPassword('');
                setStatus('idle');
                setMessage('');
            }, 1500);

        } catch (err) {
            setStatus('error');
            setMessage(err.message || "Invalid credentials");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4 text-[var(--cruk-darkblue)]">Researcher Sign In</h2>
                
                {status === 'error' && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
                        {message}
                    </div>
                )}
                {status === 'success' && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded text-sm font-bold flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email" placeholder="Email" required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading' || status === 'success'}
                    />
                    <input
                        type="password" placeholder="Password" required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[var(--cruk-darkblue)] focus:ring-1 focus:ring-[var(--cruk-darkblue)]"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        disabled={status === 'loading' || status === 'success'}
                    />
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded" disabled={status === 'loading' || status === 'success'}>Cancel</button>
                        <button type="submit" className="btn px-4 py-2" disabled={status === 'loading' || status === 'success'}>
                            {status === 'loading' ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignInModal;
import React, { useState } from 'react';

const SignInModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch('http://127.0.0.1:8000/token', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            console.log("DEBUG: Raw Login Data:", data);
            const userId = data.user?.id?.toString() || "";
            if (!response.ok) throw new Error(data.detail || 'Login failed');

                // 1. Store the numeric ID required for project/dataset ownership
                localStorage.setItem('userId', data.user.id.toString());
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('userName', data.user.name);

                // 2. Ensure the teams array is stringified for LocalStorage
                localStorage.setItem('userTeams', JSON.stringify(data.user.teams));

                // 3. Pass the full user object to the Header
                onLoginSuccess(data.user);
                onClose();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4 text-[var(--cruk-darkblue)]">Researcher Sign In</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email" placeholder="Email" required
                        className="w-full p-2 border rounded"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="Password" required
                        className="w-full p-2 border rounded"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500">Cancel</button>
                        <button type="submit" className="btn px-4 py-2">Sign In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignInModal;
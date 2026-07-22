import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    const token = localStorage.getItem('token');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');
        
        if (newPassword !== newPasswordRepeat) {
            return setError("New passwords do not match.");
        }
        
        try {
            const res = await fetch(`${API_BASE_URL}/me/password`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    old_password: oldPassword, 
                    new_password: newPassword 
                })
            });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Failed to change password');
            }
            
            setSuccessMessage("Password successfully changed!");
            setOldPassword('');
            setNewPassword('');
            setNewPasswordRepeat('');
            setShowPassword(false);
            
            // Auto close after 2 seconds
            setTimeout(() => {
                onClose();
                setSuccessMessage('');
            }, 2000);
            
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Change Password</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
                </div>
                
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium border border-red-200">{error}</div>}
                {successMessage && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm font-medium border border-green-200">{successMessage}</div>}
                
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            autoComplete="new-password"
                            value={oldPassword} 
                            onChange={e => setOldPassword(e.target.value)} 
                            className="w-full p-2 border border-gray-400 rounded-md bg-white focus:ring-2 focus:ring-blue-500 shadow-sm pr-10"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 font-bold px-2">
                            {showPassword ? "👁️‍🗨️" : "👁️"}
                        </button>
                    </div>
                    
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            autoComplete="new-password"
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)} 
                            className="w-full p-2 border border-gray-400 rounded-md bg-white focus:ring-2 focus:ring-blue-500 shadow-sm pr-10"
                        />
                    </div>
                    
                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Repeat New Password</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required 
                            autoComplete="new-password"
                            value={newPasswordRepeat} 
                            onChange={e => setNewPasswordRepeat(e.target.value)} 
                            className="w-full p-2 border border-gray-400 rounded-md bg-white focus:ring-2 focus:ring-blue-500 shadow-sm pr-10"
                        />
                    </div>
                    
                    <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow transition-colors">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

import React, { useState } from 'react';

const SignIn = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("DEBUG: Attempting login for:", email);

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
        const response = await fetch('http://127.0.0.1:8000/token', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        console.log("DEBUG: Full Response from FastAPI:", data); // Check this in console!

        if (!response.ok) throw new Error(data.detail || 'Login failed');

        // Check if the expected structure exists
        if (!data.user || !data.user.name) {
            console.error("DEBUG: User object or name missing in response!", data);
            throw new Error("Server response missing user profile data");
        }

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userName', data.user.name);

        console.log("DEBUG: Success! Calling onLoginSuccess with:", data.user);
        if (onLoginSuccess) onLoginSuccess(data.user);
    } catch (err) {
        console.error("DEBUG: Login Catch Error:", err.message);
        alert(err.message);
    } finally {
        setIsLoading(false);
    }
};

    return (
        <form onSubmit={handleLogin} className="flex items-center space-x-2">
            <input
                type="email"
                placeholder="Email"
                className="p-1 text-sm border rounded text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className="p-1 text-sm border rounded text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button
                type="submit"
                className="btn py-1 px-3"
                disabled={isLoading}
            >
                {isLoading ? '...' : 'Login'}
            </button>
        </form>
    );
};

export default SignIn;
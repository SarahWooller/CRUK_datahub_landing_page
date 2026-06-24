import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize state from storage on mount
        const token = localStorage.getItem('token');
        const userId = parseInt(localStorage.getItem('userId'), 10);
        const activeTeamId = parseInt(localStorage.getItem('activeTeamId'), 10);

        if (token && userId) {
            setUser({
                token,
                id: userId,
                activeTeamId: isNaN(activeTeamId) ? null : activeTeamId,
                // Assuming you might store or fetch a list of authorized teams
                teams: JSON.parse(localStorage.getItem('teams')) || []
            });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userId', userData.id);
        if (userData.activeTeamId) {
            localStorage.setItem('activeTeamId', userData.activeTeamId);
        }
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('activeTeamId');
        localStorage.removeItem('teams');
        setUser(null);
    };

    const updateActiveTeam = (teamId) => {
        localStorage.setItem('activeTeamId', teamId);
        setUser(prev => ({ ...prev, activeTeamId: teamId }));
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateActiveTeam, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for easier consumption
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
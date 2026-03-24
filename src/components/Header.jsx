import React, { useState, useEffect} from 'react';

import "../styles/style.css"
import SignInModal from './SignInModal';
import UserMenu from './UserMenu';

export const Header = () => {
    const [user, setUser] = useState(null);
    const [activeTeamId, setActiveTeamId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
    const name = localStorage.getItem('userName');
    const teamsRaw = localStorage.getItem('userTeams');

    // Check if the data exists and is NOT the literal string "undefined"
    if (name && teamsRaw && teamsRaw !== "undefined") {
        try {
            const parsedTeams = JSON.parse(teamsRaw);
            setUser({ name, teams: parsedTeams });
            setActiveTeamId(localStorage.getItem('activeTeamId') || "");
        } catch (e) {
            console.error("Failed to parse teams from localStorage", e);
            // If data is corrupt, clear it to prevent infinite crashing
            localStorage.removeItem('userTeams');
        }
    }
}, []);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        const firstId = userData.teams?.[0]?.id.toString() || "";
        setActiveTeamId(firstId);
        localStorage.setItem('activeTeamId', firstId);
        localStorage.setItem('userTeams', JSON.stringify(userData.teams));
        localStorage.setItem('userName', userData.name);
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setActiveTeamId("");
    };

    const logoStyle = {
        width: 'auto',
        height: 'auto',
    };

    const titleStyle = {
        fontSize: '2rem',
        fontWeight: '900',
        textDecoration: 'none',
        color: 'inherit',
        display: 'inline-block'
    };

return (
        <header className="main-header p-2 sm:p-8 bg-gray-50 border-b">
            <div className="banner flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <a href="https://www.cancerresearchuk.org/">
                        <img src="../assets/cruk-logo.svg" alt="CRUK Logo" className="h-10 w-auto" />
                    </a>
                    <a href="./dashboard.html" className="no-underline color-inherit">
                        <h1 className="strap-line text-2xl font-black">CRUK Data Hub</h1>
                    </a>
                </div>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <UserMenu
                            user={user}
                            activeTeamId={activeTeamId}
                            onLogout={handleLogout}
                            onTeamSwitch={(id) => {
                                setActiveTeamId(id.toString());
                                localStorage.setItem('activeTeamId', id.toString());
                            }}
                        />
                    ) : (
                        <button onClick={() => setIsModalOpen(true)} className="btn px-4">Sign In</button>
                    )}
                    <a href="https://fdm2p6.csb.app/"><button className="btn px-4">Help</button></a>
                </div>
            </div>

            <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLoginSuccess={handleLoginSuccess} />

            {/* Standard Nav Links */}
            <nav className="thin-navbar mt-4">
                <ul className="flex space-x-6 text-sm">
                    <li><a href="./about.html">About</a></li>
                    <li><a href="./protect_data.html">Data Protection</a></li>
                </ul>
            </nav>
        </header>
    );
};
import React, { useState, useEffect } from 'react';
import SignInModal from './SignInModal.jsx';
import "../styles/style.css"

export const Header = () => {
    const [userName, setUserName] = useState(null);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('teamId');
        localStorage.removeItem('activeTeamId');
        setUserName(null);
        window.location.reload();
    };

    const handleLoginSuccess = (user) => {
        setUserName(user.name);
        setIsSignInModalOpen(false);
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
        <header className="main-header p-2 sm:p-8 bg-gray-50">
            <div className="banner">
                <div className="logo-placeholder">
                    <p>
                        <a href="https://www.cancerresearchuk.org/">
                            <img src="../assets/cruk-logo.svg" alt="CRUK Logo" style={logoStyle} />
                        </a>
                    </p>
                </div>

                <a href="./dashboard.html" style={titleStyle}>
                    <h1 className="strap-line">CRUK Data Hub</h1>
                </a>

                <div className="header-buttons">
                    {userName ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">Welcome, <strong>{userName}</strong></span>
                            <button className="btn" style={{backgroundColor: '#6b7280'}} onClick={handleLogout}>Sign out</button>
                        </div>
                    ) : (
                        <button className="btn" onClick={() => setIsSignInModalOpen(true)}>Sign in</button>
                    )}
                    <a href="https://fdm2p6.csb.app/">
                        <button className="btn">Help</button>
                    </a>
                </div>
            </div>

            <SignInModal 
                isOpen={isSignInModalOpen} 
                onClose={() => setIsSignInModalOpen(false)} 
                onLoginSuccess={handleLoginSuccess} 
            />

            <nav className="thin-navbar">
                <ul>
                    <li><a href="./about.html">About</a></li>
                    <li>
                        <a href="https://www.cancerresearchuk.org/funding-for-researchers/research-opportunities-in-data-science">
                            CRUK Data Strategy
                        </a>
                    </li>
                    <li><a href="./protect_data.html">How we protect your data</a></li>

                    {/* Data Custodian Area - Hover Only Dropdown */}
                    <li className="nav-dropdown-container">
                        <a href="#" className="nav-link-main">
                            Data Custodian Area
                        </a>

                        <ul className="nav-dropdown-menu">
                            <li>
                                <a href="./upload_project.html">
                                    upload or change project
                                </a>
                            </li>
                            <li>
                                <a href="./upload.html">
                                    upload or change dataset
                                </a>
                            </li>
                            <li>
                                <a href="./upload_publications.html">
                                    upload and link publications
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
import React from 'react';
import "../styles/style.css"

export const Header = () => {
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
                    <a href="./sign_in.html">
                        <button className="btn">Sign in</button>
                    </a>
                    <a href="https://fdm2p6.csb.app/">
                        <button className="btn">Help</button>
                    </a>
                </div>
            </div>

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
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
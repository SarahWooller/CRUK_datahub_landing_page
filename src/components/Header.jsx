import React from 'react';
import "../styles/style.css"

// Define the functional component called Header
export const Header = () => {
    // Define the inline style object for the image
    const logoStyle = {
        width: 'auto',
        height: 'auto',
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
                <h2 className="strap-line">CRUK Data Hub</h2>

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
                        <a href="https://www.cancerresearchuk.org/funding-for-researchers/research-opportunities-in-data-science?_gl=1*j2h94s*_gcl_aw*R0NMLjE3NTIwNjY3ODcuQ2p3S0NBandwcmpEQmhCVEVpd0ExbTFkMG9kQ3M5bktReW14VlplOW5FUWJ4R0l2X0E4ekdieVpTaVZaWUNBUm1hZ09BN2t1anhNbTlCb0NNSm9RQXZEX0J3RQ..*_gcl_dc*R0NMLjE3NTIwNjY3ODcuQ2p3S0NBandwcmpEQmhCVEVpd0ExbTFkMG9kQ3M5bktReWymxVplOW5FUWJ4R0l2X0E4ekdieVpTaVZaWUNBUm1hZ09BN2t1anhNbTlCb0NNSm9RQXZEX0J3RQ..*_gcl_au*NTU0Mjk1Mzc0LjE3NDg4NjEwMTc.*_ga*MTg1NjY3MDg4OC4xNzQxMDA5MjYx*_ga_58736Z2GNN*czE3NTUyNTE1NTAkbzY0JGcxJHQxNzU1MjUxNjQ4JGo1MCRsMCRoMA..">
                            CRUK Data Strategy
                        </a>
                    </li>
                    <li><a href="./protect.html">How we protect your data</a></li>
                    <li><a href="./upload.html">Data Custodian Area</a></li>

                </ul>
            </nav>
        </header>
    );
};


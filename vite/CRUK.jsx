import React from 'react';
import "../styles/style.css"

// Define the functional component called Header
export const CRUKBanner = () => {
    // Define the inline style object for the image
    const logoStyle = {
        width: '200px',
        height: 'auto',
    };

    return (
        <header className="main-header p-2 sm:p-8 bg-gray-50">
            <div className="banner">
                <div className="logo-placeholder">
                    <p>
                        <a href="https://www.cancerresearchuk.org/">
                            <img src="./cruk-logo.svg" alt="CRUK Logo" style={logoStyle} />
                        </a>
                    </p>
                </div>
            </div>
        <header>
            )
import React from 'react';

export const DatahubDashboard = () => {
  const containerStyle = {
    backgroundColor: '#f0f7ff',
    maxWidth: '80%',
    margin: '40px auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'minmax(250px, 1fr) auto auto',
    gap: '24px',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    color: '#003580',
    fontSize: '1.15rem',
    boxSizing: 'border-box',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  const headerLeftStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: '20px'
  };

  const headerRightStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end'
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '12px 0'
  };

  const buttonStyle = {
    backgroundColor: '#f5f5f5',
    color: '#4a4a4a',
    border: '1px solid #d1d1d1',
    padding: '10px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1.05rem',
    display: 'inline-block',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, border-color 0.2s ease'
  };

  const linkStyle = {
    color: '#003580',
    textDecoration: 'none',
    borderBottom: '2px solid #e40085',
    paddingBottom: '2px',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  const headingStyle = {
    margin: '0 0 16px 0',
    fontSize: '2rem',
    color: '#003580'
  };

  return (
    <div style={containerStyle}>
      {/* Top Row: Left Panel */}
      <div style={headerLeftStyle}>
        <h1 style={headingStyle}>What would you like to find today?</h1>
                <p >
                    Welcome to the CRUK Data Hub, your gateway to data produced by research funded through Cancer Research UK.
                </p>


      </div>

      {/* Top Row: Right Panel */}
      <div style={headerRightStyle}>

        <img
          src="../dashboard.png"
          alt="CRUK Datahub Poster"

        />

      </div>

      {/* Middle Row */}
      <div style={buttonContainerStyle}>
        <a href="./studies2.html" style={buttonStyle}>Browse or Search Datasets</a>
      </div>
      <div style={buttonContainerStyle}>
        <a href="/page-2" style={buttonStyle}>Browse or Search Projects</a>
      </div>

      {/* Bottom Row */}
      <div style={buttonContainerStyle}>
        <a href="/page-3" style={buttonStyle}>Browse or search associated Publications</a>
      </div>
      <div style={buttonContainerStyle}>
        <a href="/page-4" style={buttonStyle}>Browse or search associated Tools</a>
      </div>
    </div>
  );
};
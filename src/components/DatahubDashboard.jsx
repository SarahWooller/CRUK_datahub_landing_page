import React from 'react';

export const DatahubDashboard = () => {
  const containerStyle = {
    backgroundColor: '#f0f7ff',
    maxWidth: '90%',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#003580',
    fontSize: '1.25rem',
    boxSizing: 'border-box',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  const heroSectionStyle = {
    position: 'relative',
    width: '100%',
    height: '450px',
    backgroundImage: 'url("../scientist.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center'
  };

  const insetBoxStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    marginLeft: '5%',
    maxWidth: '500px',
    borderRadius: '4px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
    borderLeft: '6px solid #e40085'
  };

  const headingStyle = {
    margin: '0 0 16px 0',
    fontSize: '2.4rem',
    color: '#003580',
    lineHeight: '1.1'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  };

  const buttonStyle = {
    backgroundColor: '#ffffff',
    color: '#003580',
    border: '1px solid #d1d1d1',
    padding: '20px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1.2rem',
    textAlign: 'center',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    display: 'block'
  };

  const focusSectionStyle = {
    marginTop: '40px'
  };

  // Updated CTA Styles
  const ctaContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #d1d1d1',
    backgroundColor: '#ffffff',
    textDecoration: 'none',
    overflow: 'hidden',
    minHeight: '140px',
    transition: 'all 0.2s ease'
  };

  const ctaImageStyle = {
    width: '25%',
    backgroundImage: 'url("../crh.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const ctaTextStyle = {
    width: '75%',
    color: '#003580',
    padding: '20px',
    fontSize: '1.2rem',
    textAlign: 'center',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section with Inset Strapline */}
      <div style={heroSectionStyle}>
        <div style={insetBoxStyle}>
          <h1 style={headingStyle}>What would you like to find today?</h1>
          <p>
            Welcome to the CRUK Data Hub, your gateway to data produced by research funded through Cancer Research UK
          </p>
        </div>
      </div>

      {/* Navigation Grid */}
      <div style={gridStyle}>
        <a href="./studies2.html" style={buttonStyle}>Browse or Search Datasets</a>
        <a href="/page-2" style={buttonStyle}>Browse or Search Projects</a>
        <a href="/page-3" style={buttonStyle}>Browse or Search Associated Publications</a>
        <a href="/page-4" style={buttonStyle}>Browse or Search Associated Tools</a>
      </div>

      {/* Research Focus Section */}
      <div style={focusSectionStyle}>
        <a href="/horizons" style={ctaContainerStyle}>
          <div style={ctaImageStyle} aria-hidden="true"></div>
          <div style={ctaTextStyle}>
            Explore Cancer Research Horizons Data Resources
          </div>
        </a>
      </div>
    </div>
  );
};
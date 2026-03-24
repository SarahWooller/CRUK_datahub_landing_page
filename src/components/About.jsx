import React from 'react';
import "../styles/style.css"

export const About = () => {
    // These styles mimic your original HTML file's internal CSS
    const pageStyle = {
        fontFamily: 'sans-serif',
        lineHeight: '1.6',
        color: '#333',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontSize: '1.2rem',
    };

    const headerStyle = {
        borderBottom: '2px solid #005ea5',
        marginBottom: '20px',
        paddingBottom: '10px',
    };

    const h1Style = {
        color: '#005ea5',
        marginBottom: '5px',
    };

    return (
        <div style={pageStyle}>
            <header style={headerStyle}>
                <h1 style={h1Style}>The CRUK Pilot Data Hub</h1>
                <p className="authors" style={{ fontStyle: 'italic', color: '#555', marginBottom: '20px' }}>
                    Authors: Sarah Wooller, Ayoola Olojede, Andrew Blake, Joseph Day, Frances Pearl 
                </p>
            </header>

            <main>
                <section className="content-section" style={{ marginBottom: '15px' }}>
                    <p>
                        In 2024 the Nobel Prize for Chemistry was awarded to the AlphaFold team for their strides in protein folding. 
                        Whilst this was an extraordinary feat it was one made possible by the access that the teams had to 
                        standardized data on protein structures in a common format, mandated by publishing requirements.
                    </p>
                    
                    <p>
                        Cancer research is increasingly evolving toward a multidisciplinary approach, driven by the scale, 
                        diversity, and sophistication of the available data, and by the data-processing tools and infrastructure 
                        associated with them. Yet finding and accessing cancer data remains extremely challenging. In England 
                        alone there are 11 regional Secure Data Environments and over 100 Data Custodians listed on the 
                        HDRUK’s health data gateway.
                    </p>
                </section>

                <section className="content-section" style={{ marginBottom: '15px' }}>
                    <p>
                        Cancer Research UK is aiming to improve the reuse of data funded by the charity, whilst continuing to 
                        put the patient first. To do this it is focusing on implementing the FAIR principles—making data that 
                        CRUK funds Findable, Accessible, Interoperable, and Reusable—to accelerate the translation of big data 
                        into patient benefits. The CRUK Data Hub is central to this strategy.
                    </p>
                    
                    <p>
                        The Pearl lab at the University of Sussex has teamed up with CRUK to develop a metadata catalogue for 
                        their research datasets. Using the enormous power of the HDRUK health data gateway as a backend, we 
                        are giving it a new look, focusing on what cancer researchers really need to know about the datasets 
                        they are looking for:
                    </p>
                    
                    <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>
                        <li>Which cancers is the dataset focusing on? </li>
                        <li>What type of data does it contain? </li>
                        <li>What are the access conditions? </li>
                    </ul>

                    <p>
                        In addition, the datahub will provide rich metadata about the datasets and link back to the health data 
                        gateway in order to streamline the access process. At the same time, we do not want to duplicate the 
                        HDRUK health data gateway so all data uploaded to the CRUK data hub will also be available through the gateway.
                    </p>
                </section>
            </main>

            <footer className="footer" style={{ marginTop: '30px', paddingTop: '10px', borderTop: '1px solid #ccc', fontWeight: 'bold' }}>
                <p>The data hub will be up and running by the end of the year.</p>
                <p>
                    Go to our <a href="https://sarahwooller.github.io/CRUK_datahub_landing_page/" style={{ color: '#005ea5' }}>index</a> page 
                    to get started on exploring the hub – and feel free to leave feedback.
                </p>
            </footer>
        </div>
    );
};
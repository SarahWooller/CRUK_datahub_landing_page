import { createRoot } from 'react-dom/client'

const App = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '2vw',
    padding: '2vh 2vw',
    alignItems: 'stretch',
    fontFamily: 'sans-serif',
    height: '100vh',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9'
  };

  // Flexible container for the poster
  const posterContainerStyle = {
    flex: '1.5', // Takes up more space than the text section
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    overflow: 'hidden'
  };

  // Ensures the poster scales without distortion
  const posterImageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '4px'
  };

  // Scalable text side on the right
  const contentStyle = {
    flex: '1', // Scales proportionally with the screen
    maxWidth: '450px',
    minWidth: '280px',
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflowY: 'auto',
    fontSize: '1.1rem' // Larger font per general preference
  };

  return (
    <div style={containerStyle}>

      <div style={contentStyle}>
        <h2 style={{ color: '#00007a', marginTop: 0 }}>CRUK Datahub Navigation</h2>
        <p>The most up to date pages are as follows</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p>
            <a href="./src/alt_studies.html"><b>The search page</b> - for finding studies and displaying a brief synopsis.</a>
          </p>
          <p>
            <a href="https://gateway-web-five.vercel.app/en/search?type=datasets"><b>We are currently in the process of linking our search page</b> That page should appear here shortly.</a>
          </p>

          <p>
            <a href="./src/meta.html"><b>The metadata details page </b> - For displaying the metadata of the selected dataset.</a>
          </p>
          <p>
            <a href="./src/upload.html"><b> The upload page </b> - For uploading data.</a>

          </p>

        </div>
      </div>

      <div style={posterContainerStyle}>
        <img
          src="/poster.png"
          alt="CRUK Datahub Poster"
          style={posterImageStyle}
        />
      </div>


    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);
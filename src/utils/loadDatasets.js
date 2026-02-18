// loadDatasets.js
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'datasets'); // Path to your 20 JSONs
const outputPath = path.join(__dirname, 'src/data/all_studies.json');

const loadFiles = () => {
    try {
        const files = fs.readdirSync(directoryPath);
        const combinedData = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const content = fs.readFileSync(path.join(directoryPath, file), 'utf8');
                return JSON.parse(content);
            });

        fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2));
        console.log(`Successfully compiled ${combinedData.length} datasets into ${outputPath}`);
    } catch (err) {
        console.error('Error processing files:', err);
    }
};

loadFiles();
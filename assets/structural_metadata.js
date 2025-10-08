// script.js

// Structure the raw data into a more accessible JavaScript object.
// The key is the table name, and the value contains the description and an array of its columns.
const metadata = {
    "CLIENT": {
        "description": "Client-level object; a container for this client's episodes.",
        "columns": [
            { "Field": "ClientID", "Label": "ClientID", "Type": "string", "Nullable": "false" },
            { "Field": "Classification", "Label": "Classification", "Type": "string", "Nullable": "false" }
        ]
    },
    "EPISODE": {
        "description": "Episode information. The key of this object is the episode ID.",
        "columns": [
            { "Field": "Episode ID", "Label": "Episode ID", "Type": "string", "Nullable": "false" },
            { "Field": "IntervalCancerType", "Label": "IntervalCancerType", "Type": "string,null", "Nullable": "false" },
            { "Field": "EpisodeIsClosed", "Label": "EpisodeIsClosed", "Type": "string,null", "Nullable": "false" },
            { "Field": "EpisodeType", "Label": "EpisodeType", "Type": "string,null", "Nullable": "false" },
            { "Field": "PatientAge", "Label": "PatientAge", "Type": "integer", "Nullable": "false" },
            { "Field": "AccessionID", "Label": "AccessionID", "Type": "string,null", "Nullable": "false" },
            { "Field": "IntervalCancerSizeMm", "Label": "IntervalCancerSizeMm", "Type": "string,null", "Nullable": "false" },
            { "Field": "EpisodeClosedDate", "Label": "EpisodeClosedDate", "Type": "string,null", "Nullable": "false" },
            { "Field": "IntervalCancerDateOfDiagnosis", "Label": "IntervalCancerDateOfDiagnosis", "Type": "string,null", "Nullable": "false" },
            { "Field": "IntervalCancerDateOfReview", "Label": "IntervalCancerDateOfReview", "Type": "string,null", "Nullable": "false" },
            { "Field": "EpisodeOpenedDate", "Label": "EpisodeOpenedDate", "Type": "string,null", "Nullable": "false" },
            { "Field": "EpisodeAction", "Label": "EpisodeAction", "Type": "string,null", "Nullable": "false" },
            { "Field": "IntervalCancerDateOfRegional", "Label": "IntervalCancerDateOfRegional", "Type": "string,null", "Nullable": "false" },
            { "Field": "StudyList", "Label": "Comma-separated Study Instance UIDs", "Type": "string,null", "Nullable": "false" }
        ]
    },
    "SCREENING": {
        "description": "Contains screening film side-dependent information.",
        "columns": [
            { "Field": "diagnosticsetoutcome", "Label": "diagnosticsetoutcome", "Type": "string,null", "Nullable": "false" },
            { "Field": "Opinion", "Label": "Opinion", "Type": "string,null", "Nullable": "false" }
        ]
    }
};

// Function to generate the HTML for the columns table
function generateTableHTML(columns) {
    let html = `
        <table class="column-details">
            <thead>
                <tr>
                    <th>Field</th>
                    <th>Label</th>
                    <th>Type</th>
                    <th>Nullable</th>
                </tr>
            </thead>
            <tbody>
    `;

    columns.forEach(col => {
        html += `
            <tr>
                <td>${col.Field}</td>
                <td>${col.Label}</td>
                <td>${col.Type}</td>
                <td>${col.Nullable}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;
    return html;
}

// Function to render all data into the HTML structure
function renderMetadata() {
    const container = document.getElementById('metadata-container');

    for (const tableName in metadata) {
        const data = metadata[tableName];
        const tableHTML = generateTableHTML(data.columns);

        // Create the main table section container
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('table-section');

        // Create the header that is always visible and clickable
        const header = document.createElement('div');
        header.classList.add('table-header');
        header.innerHTML = `
            <span class="toggle-icon">+</span>
            <span class="table-name">${tableName}</span>
            <p class="table-description">${data.description}</p>
        `;
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon');

            content.classList.toggle('active');
            icon.textContent = content.classList.contains('active') ? '–' : '+';
        });

        // Create the hidden content (the columns table)
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('table-content');
        contentDiv.innerHTML = tableHTML;

        sectionDiv.appendChild(header);
        sectionDiv.appendChild(contentDiv);
        container.appendChild(sectionDiv);
    }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', renderMetadata);
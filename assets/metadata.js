document.addEventListener('DOMContentLoaded', () => {
    const nameList = document.getElementById('name-list');
    const rightPanelContent = document.getElementById('right-panel-content');

    // Data for the Left Navigation Bar
    const dummyNames = [
        "Keywords",
        "Summary",
        "Documentation",
        "Structural Metadata",
        "Data Access Request",
        "Provenance",
        "Observations"
     ];

    // Data for the New Right-Hand Panel
    const rightPanelData = [
        {
            title: "Cancer Types",
            items: [
                {
                    name: "ICD-O Topography",
                    subItems: ["C64.9 Kidney, NOS"]
                },
                {
                    name: "ICD-O Histology",
                    subItems: ["8312/3 Renal Cell Carcinoma, NOS", "8310/3 Clear Cell Renal Cell Carcinoma"]
                }
            ]
        },
        {
            title: "Patient Study",
            items: [
                {
                    name: "Background Study",
                    subItems: ["Demographic", "Lifestyle"]
                },
                {
                    name: "Biobank Samples",
                    subItems: ["Bloods", "Tissues"]
                },
                {
                    name: "Imaging Data",
                    subItems: ["Radiographic Imaging"]
                },
                {
                    name: "Longitudinal Follow up"
                },
                {
                    name: "Treatments"
                }
            ]
        }
    ];

    // Function to populate the Left Navigation Bar
    dummyNames.forEach(name => {
        const listItem = document.createElement('li');
        listItem.textContent = name;
        nameList.appendChild(listItem);
    });

    // Function to recursively build the right-hand panel content
    function createNestedList(data) {
        // Create an unordered list
        const ul = document.createElement('ul');

        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;

            // If there are sub-items, recursively call the function
            if (item.subItems && item.subItems.length > 0) {
                // Convert simple array of strings into the object structure for recursion
                const nestedData = item.subItems.map(subName => ({ name: subName }));
                const nestedUl = createNestedList(nestedData);
                li.appendChild(nestedUl);
            }

            ul.appendChild(li);
        });
        return ul;
    }

    // Function to populate the Right-Hand Panel
    function populateRightPanel() {
        rightPanelData.forEach(section => {
            // Section Title
            const h4 = document.createElement('h4');
            h4.textContent = section.title;
            rightPanelContent.appendChild(h4);

            // Nested Lists
            const list = createNestedList(section.items);
            rightPanelContent.appendChild(list);
        });
    }

    // Execute the population of the right panel
    populateRightPanel();
});

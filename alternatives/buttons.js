// Data Constant: Filter examples structured in JSON format
const filterData = {
    cancerTypes: {
        // RESTRUCTURED to be nested based on user request
        icdOHistology: [
            {
                id: 'h_all',
                label: 'Include All Histologies',
                count: 600,
                children: [
                    {
                        id: 'h_800',
                        label: '800 Neoplasms, NOS',
                        count: 350,
                        children: [
                            // Added category property for clarity in chip labeling
                            { id: 'h_8000_0', label: '8000/0 Neoplasm, benign', count: 50, category: 'Histology' },
                            { id: 'h_8000_1', label: '8000/1 Neoplasm, uncertain', count: 30, category: 'Histology' },
                            { id: 'h_8000_3', label: '8000/3 Neoplasm, malignant', count: 150, category: 'Histology' },
                            { id: 'h_8000_6', label: '8000/6 Neoplasm, metastatic', count: 70, category: 'Histology' },
                            { id: 'h_8000_9', label: '8000/9 Neoplasm, malignant, uncertain', count: 50, category: 'Histology' },
                        ]
                    },
                    { id: 'h_8140', label: '8140/3 - Adenocarcinoma, NOS', count: 85, category: 'Histology' },
                    { id: 'h_8500', label: '8500/3 - Infiltrating duct carcinoma', count: 70, category: 'Histology' },
                    { id: 'h_9590', label: '9590/3 - Lymphoma, NOS', count: 50, category: 'Histology' },
                ]
            }
        ],
        // Nested structure for Topography (kept as is)
        icdOTopography: [
            {
                id: 't_all', label: 'All Topography Sites', count: 400, children: [
                    {
                        id: 't1', label: 'C00-C14 Lip, Oral Cavity and Pharynx', count: 180, children: [
                            { id: 't1_1', label: 'C00 Lip', count: 90, category: 'Topography' },
                            { id: 't1_2', label: 'C01 Tongue Base', count: 50, category: 'Topography' },
                            { id: 't1_3', label: 'C04 Floor of mouth', count: 40, category: 'Topography' }
                        ]
                    },
                    {
                        id: 't2', label: 'C15-C26 Digestive Organs', count: 150, children: [
                            { id: 't2_1', label: 'C18 Colon', count: 100, category: 'Topography' },
                            { id: 't2_2', label: 'C25 Pancreas', count: 50, category: 'Topography' },
                        ]
                    },
                    { id: 't3', label: 'C50 Breast', count: 70, category: 'Topography' }, // Flat item at this level
                    { id: 't4', label: 'C34 Bronchus and lung', count: 90, category: 'Topography' },
                    { id: 't5', label: 'C71 Brain', count: 60, category: 'Topography' }
                ]
            }
        ],
        crukTerms: [
            { id: 'c1', label: 'Breast Cancer', count: 24, category: 'CRUK Term' },
            { id: 'c2', label: 'Lung Cancer', count: 18, category: 'CRUK Term' },
            { id: 'c3', label: 'Colorectal Cancer', count: 12, category: 'CRUK Term' },
            { id: 'c4', label: 'Prostate Cancer', count: 10, category: 'CRUK Term' },
            { id: 'c5', label: 'Blood Cancer', count: 8, category: 'CRUK Term' },
            { id: 'c6', label: 'Brain Tumours', count: 7, category: 'CRUK Term' },
            { id: 'c7', label: 'Ovarian Cancer', count: 5, category: 'CRUK Term' },
            { id: 'c8', label: 'Melanoma', count: 4, category: 'CRUK Term' },
            { id: 'c9', label: 'Thyroid Cancer', count: 3, category: 'CRUK Term' },
            { id: 'c10', label: 'Kidney Cancer', count: 2, category: 'CRUK Term' },
        ]
    },
    dataType: {
        biobankSamples: [
            { id: 'bb_all', label: 'Biobank Samples', count: 980, children: [
                { id: 'bb_material', label: 'Material Type', count: 700, children: [
                    { id: 'bb_m_all', label: 'include all', count: 700, category: 'Biobank' },
                    { id: 'bb_m1', label: 'Bloods', count: 250, category: 'Biobank' },
                    { id: 'bb_m2', label: 'Cells - eg cell lines', count: 180, category: 'Biobank' },
                    { id: 'bb_m3', label: 'Genetic material', count: 150, category: 'Biobank' },
                    { id: 'bb_m4', label: 'Other Fluids - eg urine', count: 50, category: 'Biobank' },
                    { id: 'bb_m5', label: 'Organoids', count: 30, category: 'Biobank' },
                    { id: 'bb_m6', label: 'Tissues - eg Bone marrow aspirate', count: 40, category: 'Biobank' },
                    { id: 'bb_m7', label: 'Other - eg swab', count: 20, category: 'Biobank' }
                ]},
                { id: 'bb_state', label: 'State', count: 980, children: [
                    { id: 'bb_s1', label: 'Malignant', count: 500, category: 'Biobank' },
                    { id: 'bb_s2', label: 'Normal', count: 350, category: 'Biobank' },
                    { id: 'bb_s3', label: 'Pre-cancerous', count: 130, category: 'Biobank' }
                ]}
            ]}
        ],
        inVitroStudy: [
            { id: 'iv_all', label: 'In Vitro Studies', count: 450, children: [
                { id: 'iv_model', label: 'Model', count: 400, children: [
                    { id: 'iv_m_all', label: 'include all', count: 400, category: 'In Vitro' },
                    { id: 'iv_m1', label: 'Organ on a Chip', count: 120, category: 'In Vitro' },
                    { id: 'iv_m2', label: '3D organoid (including on a chip)', count: 200, category: 'In Vitro' },
                    { id: 'iv_m3', label: 'Organ slice', count: 80, category: 'In Vitro' }
                ]},
                { id: 'iv_cell', label: 'Cell Source', count: 450, children: [
                    { id: 'iv_c_all', label: 'include all', count: 450, category: 'In Vitro' },
                    { id: 'iv_c1', label: 'Immortalised cell-line', count: 150, category: 'In Vitro' },
                    { id: 'iv_c2', label: 'Patient derived', count: 250, category: 'In Vitro' },
                    { id: 'iv_c3', label: 'Animal', count: 50, category: 'In Vitro' }
                ]}
            ]},
            { id: 'iv_treatment', label: 'Treatment', count: 350, children: [
                { id: 'iv_t_all', label: 'include all', count: 350, category: 'In Vitro' },
                { id: 'iv_t1', label: 'Cell and cell-derived treatment', count: 100, category: 'In Vitro' },
                { id: 'iv_t2', label: 'Gene knock-down', count: 50, category: 'In Vitro' },
                { id: 'iv_t3', label: 'Medication', count: 150, category: 'In Vitro' },
                { id: 'iv_t4', label: 'Radiation', count: 50, category: 'In Vitro' }
            ]}
        ],
        animalModel: [
            { id: 'am_all', label: 'Animal Studies', count: 300, children: [
                { id: 'am_animal', label: 'Animal', count: 300, children: [
                    { id: 'am_a_all', label: 'include all', count: 300, category: 'Animal Model' },
                    { id: 'am_a1', label: 'Chicken', count: 20, category: 'Animal Model' },
                    { id: 'am_a2', label: 'Dog', count: 30, category: 'Animal Model' },
                    { id: 'am_a3', label: 'Fruit fly', count: 50, category: 'Animal Model' },
                    { id: 'am_a4', label: 'Mouse', count: 150, category: 'Animal Model' },
                    { id: 'am_a5', label: 'Rabbit', count: 20, category: 'Animal Model' },
                    { id: 'am_a6', label: 'Rat', count: 30, category: 'Animal Model' }
                ]},
                { id: 'am_type', label: 'Model Type', count: 280, children: [
                    { id: 'am_t1', label: 'Xenograft', count: 150, category: 'Animal Model' },
                    { id: 'am_t2', label: 'PDX', count: 80, category: 'Animal Model' },
                    { id: 'am_t3', label: 'Genetically Engineered', count: 50, category: 'Animal Model' }
                ]}
            ]}
        ],
        patientStudies: [
            { id: 'ps_all', label: 'Patient Studies', count: 2500, children: [
                { id: 'ps_design', label: 'Study Design', count: 2500, children: [
                    { id: 'ps_d1', label: 'Observational', count: 1500, category: 'Patient Study' },
                    { id: 'ps_d2', label: 'Clinical Trial', count: 800, category: 'Patient Study' },
                    { id: 'ps_d3', label: 'Cohort', count: 200, category: 'Patient Study' }
                ]},
                { id: 'ps_stage', label: 'Disease Stage', count: 2500, children: [
                    { id: 'ps_s1', label: 'Early Stage', count: 1200, category: 'Patient Study' },
                    { id: 'ps_s2', label: 'Late Stage', count: 800, category: 'Patient Study' },
                    { id: 'ps_s3', label: 'Recurrent', count: 500, category: 'Patient Study' }
                ]}
            ]}
        ]
    }
};

// All panels that can be displayed
const PANEL_IDS = ['cancer-type-panel', 'data-type-panel', 'accessibility-panel'];
let activePanelId = null; // NEW: Track which panel is currently open

// Helper function to find a filter item's label and category by its checkbox ID
const findFilterDetails = (id) => {
    const parts = id.split('-');
    if (parts.length < 2) return null; // Invalid ID format

    // The group name is the part before the first hyphen, e.g., 'cruk'
    const groupPrefix = parts[0];
    const itemId = parts.slice(1).join('-');

    // Map the checkbox prefix back to a user-friendly category label
    const categoryMap = {
        'access': 'Accessibility',
        'cruk': 'CRUK Term',
        'histo': 'Histology',
        'topo': 'Topography',
        'bb': 'Biobank',
        'iv': 'In Vitro',
        'am': 'Animal Model',
        'ps': 'Patient Study'
    };

    // Function to recursively search through nested data structures
    const recursiveSearch = (data, targetId) => {
        if (!Array.isArray(data)) return null;

        for (const item of data) {
            // Check if this item is the target
            if (item.id === targetId) {
                return {
                    id: item.id,
                    label: item.label,
                    category: item.category || categoryMap[groupPrefix] || 'Filter',
                    fullId: `${groupPrefix}-${item.id}`
                };
            }
            // Search children if they exist
            if (item.children) {
                const found = recursiveSearch(item.children, targetId);
                if (found) return found;
            }
        }
        return null;
    };

    // Search the data structure based on the filter group
    let searchResult = null;
    if (['histo', 'topo', 'cruk'].includes(groupPrefix)) {
        // Combine all cancer types into one array for easier searching
        const allCancerItems = filterData.cancerTypes.icdOHistology
            .concat(filterData.cancerTypes.icdOTopography)
            .concat(filterData.cancerTypes.crukTerms);
        searchResult = recursiveSearch(allCancerItems, itemId);
    } else if (['bb', 'iv', 'am', 'ps'].includes(groupPrefix)) {
         // Combine all data types
         const allDataItems = filterData.dataType.biobankSamples
            .concat(filterData.dataType.inVitroStudy)
            .concat(filterData.dataType.animalModel)
            .concat(filterData.dataType.patientStudies);
         searchResult = recursiveSearch(allDataItems, itemId);
    } else if (groupPrefix === 'access') {
        // Handle hardcoded accessibility elements
        const accessItems = [
            { id: 'open', label: 'Open Access Data', category: 'Accessibility' },
            { id: 'controlled', label: 'Controlled Access Data', category: 'Accessibility' },
            { id: 'internal', label: 'Internal/Restricted Data', category: 'Accessibility' }
        ];
        searchResult = accessItems.find(item => item.id === itemId);
        if (searchResult) {
             searchResult.fullId = `${groupPrefix}-${searchResult.id}`;
        }
    }

    return searchResult;
};

// Function to create a filter list item HTML string for flat lists
const createFilterItem = (item, groupName, dataGroup) => {
    return `
        <div class="flex items-center group hover:bg-red-50 p-1 -m-1 rounded transition duration-100">
            <input type="checkbox" id="${groupName}-${item.id}" class="rounded cruk-red-checkbox mr-2 w-4 h-4 cursor-pointer" data-filter-group="${dataGroup}">
            <label for="${groupName}-${item.id}" class="text-gray-700 select-none flex-grow cursor-pointer">
                ${item.label}
                <span class="text-xs text-gray-500 ml-1">(${item.count})</span>
            </label>
        </div>
    `;
};

// Recursive function to render nested filter items for topography and histology
const renderNestedFilters = (items, groupName, dataGroup, level = 0) => {
    return items.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        // Set initial state to collapsed (false) and display to none for nested children
        const isInitiallyExpanded = false;
        const initialDisplay = 'none';

        // Indentation is applied to the main item row (the flex div)
        const rowIndentStyle = level > 0 ? `padding-left: ${level * 1.25}rem;` : '';

        let chevronElement;
        if (hasChildren) {
            // Item has children, so it is an expandable layer. Render a clickable chevron/toggle button.
            chevronElement = `
                <button type="button" class="toggle-btn w-4 h-4 flex items-center justify-center text-gray-500 hover:text-red-700 transition duration-100 mr-1" data-target="${groupName}-${item.id}-children" data-expanded="${isInitiallyExpanded}">
                    <!-- Chevron icon, rotated by CSS based on data-expanded attribute -->
                    <svg class="w-3 h-3 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            `;
        } else {
            // Item has no children (leaf node). Render a blank spacer for consistent alignment.
            chevronElement = `<span class="w-4 h-4 mr-1"></span>`;
        }


        return `
            <div class="flex flex-col">
                <div class="flex items-center group hover:bg-red-50 p-1 -m-1 rounded transition duration-100" style="${rowIndentStyle}">
                    ${chevronElement}

                    <input type="checkbox" id="${groupName}-${item.id}" class="rounded cruk-red-checkbox mr-2 w-4 h-4 cursor-pointer" data-filter-group="${dataGroup}">
                    <label for="${groupName}-${item.id}" class="text-gray-700 select-none flex-grow cursor-pointer text-sm">
                        ${item.label}
                        <span class="text-xs text-gray-500 ml-1">(${item.count})</span>
                    </label>
                </div>
                ${hasChildren ? `
                    <!-- Nested content container, only rendered if children exist. Initially hidden. -->
                    <div id="${groupName}-${item.id}-children" class="nested-list space-y-1" style="display: ${initialDisplay};">
                        ${renderNestedFilters(item.children, groupName, dataGroup, level + 1)}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
};


// Function to render filters dynamically
const renderFilters = () => {
    const { icdOHistology, icdOTopography, crukTerms } = filterData.cancerTypes;
    const { biobankSamples, inVitroStudy, animalModel, patientStudies } = filterData.dataType;

    // 1. Render ICD-O Histology (Now Nested)
    const histologyContainer = document.getElementById('icdo-histology-list');
    histologyContainer.innerHTML = renderNestedFilters(icdOHistology, 'histo', 'cancer-type');

    // 2. Render ICD-O Topography (Nested)
    const topographyContainer = document.getElementById('icdo-topography-list');
    topographyContainer.innerHTML = renderNestedFilters(icdOTopography, 'topo', 'cancer-type');

    // 3. Render CRUK Terms (Flat)
    const crukContainer = document.getElementById('cruk-terms-list');
    crukContainer.innerHTML = crukTerms.map(item => createFilterItem(item, 'cruk', 'cancer-type')).join('');

    // 4. Render Data Types (NEW)
    document.getElementById('biobank-samples-list').innerHTML = renderNestedFilters(biobankSamples, 'bb', 'data-type');
    document.getElementById('invitro-studies-list').innerHTML = renderNestedFilters(inVitroStudy, 'iv', 'data-type');
    document.getElementById('animal-studies-list').innerHTML = renderNestedFilters(animalModel, 'am', 'data-type');
    document.getElementById('patient-studies-list').innerHTML = renderNestedFilters(patientStudies, 'ps', 'data-type');
};

// Function to remove a filter when a chip is clicked
const removeFilter = (checkboxId) => {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        checkbox.checked = false;
        // Since this changes the state, we must update the UI
        updateCounts();
    }
};

// Function to generate and display the filter chips
const updateChips = () => {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const chipListContainer = document.getElementById('filter-chip-list');
    const filterArea = document.getElementById('selected-filters-area');
    const logicSummary = document.getElementById('logic-summary');
    chipListContainer.innerHTML = '';

    // If no filters are selected, collapse and hide the chip area
    if (allCheckboxes.length === 0) {
        // Apply hidden state styles
        filterArea.style.maxHeight = '0';
        filterArea.style.paddingTop = '0';
        filterArea.style.paddingBottom = '0';
        filterArea.style.opacity = '0';
        logicSummary.classList.add('hidden');
        return;
    }

    // If filters are selected, show the area with transition styles
    filterArea.style.maxHeight = '500px';
    filterArea.style.paddingTop = '0.75rem'; // p-3
    filterArea.style.paddingBottom = '0.75rem'; // p-3
    filterArea.style.opacity = '1';
    logicSummary.classList.remove('hidden');

    allCheckboxes.forEach(checkbox => {
        const group = checkbox.getAttribute('data-filter-group');
        const checkboxId = checkbox.id;

        let details = findFilterDetails(checkboxId);

        // Fallback for cases where data is not perfectly matched (e.g. placeholder access data)
        if (!details) {
            details = {
                label: checkbox.parentElement.querySelector('label')?.textContent.split('(')[0].trim() || 'Unknown Filter',
                category: group === 'cancer-type' ? 'Cancer Filter' : group === 'data-type' ? 'Data Filter' : 'Access Filter',
                fullId: checkboxId
            };
        }

        // Determine CSS class based on logic grouping (Cancer is OR, others are AND)
        const chipClass = group === 'cancer-type' ? 'filter-chip-cancer' : 'filter-chip-and';

        // Use `details.category` for the filter group label (e.g., 'Histology' or 'Biobank')
        const chipHtml = `
            <div class="filter-chip ${chipClass} inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                <span class="mr-1 opacity-75">${details.category}:</span>
                <span class="font-bold">${details.label}</span>
                <button type="button" class="ml-2 h-4 w-4 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-50 transition duration-150"
                        data-checkbox-id="${checkboxId}" onclick="removeFilter('${checkboxId}')" aria-label="Remove filter ${details.label}">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
        `;
        chipListContainer.insertAdjacentHTML('beforeend', chipHtml);
    });
};


// Function to update the selected counts
const updateCounts = () => {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    let totalSelected = 0;
    let cancerTypeSelected = 0;
    let dataTypeSelected = 0;
    let accessibilitySelected = 0;

    allCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            totalSelected++;
            const group = checkbox.getAttribute('data-filter-group');
            if (group === 'cancer-type') {
                cancerTypeSelected++;
            } else if (group === 'data-type') {
                dataTypeSelected++;
            } else if (group === 'access') {
                accessibilitySelected++;
            }
        }
    });

    // Update display counts on the nav buttons
    document.getElementById('cancer-type-count').textContent = `(${cancerTypeSelected} Selected)`;
    document.getElementById('data-type-count').textContent = `(${dataTypeSelected} Selected)`;
    document.getElementById('accessibility-count').textContent = `(${accessibilitySelected} Selected)`;
    document.getElementById('total-selected-count').textContent = totalSelected;

    // Disable Find Studies button if no filters are selected
    document.getElementById('find-studies-button').classList.toggle('opacity-50', totalSelected === 0);

    // NEW: Update the filter chips display
    updateChips();
};

// NEW: Function to hide the currently active panel and deactivate its button
const hideActivePanel = () => {
    if (activePanelId) {
        const targetPanel = document.getElementById(activePanelId);
        if (targetPanel) {
            targetPanel.classList.add('hidden');
        }

        // Deactivate the corresponding button
        const buttonType = activePanelId.split('-')[0];
        const targetButton = document.getElementById(`nav-${buttonType}`);
        if (targetButton) {
            targetButton.classList.remove('bg-gray-100', 'text-cruk-red', 'border-b-4', 'border-[#E4002B]');
            targetButton.classList.add('text-gray-600', 'hover:bg-gray-50');
        }
        activePanelId = null;
    }
};

// Function to handle panel visibility and active button state (now handles toggle behavior)
const showPanel = (panelId) => {
    const targetPanel = document.getElementById(panelId);
    const buttonType = panelId.split('-')[0];
    const targetButton = document.getElementById(`nav-${buttonType}`);

    // Check if the user is clicking the already active panel to hide it (TOGGLE behavior)
    if (activePanelId === panelId) {
        // Hide the currently active panel
        targetPanel.classList.add('hidden');
        // Deactivate the button
        targetButton.classList.remove('bg-gray-100', 'text-cruk-red', 'border-b-4', 'border-[#E4002B]');
        targetButton.classList.add('text-gray-600', 'hover:bg-gray-50');
        activePanelId = null; // Reset tracker
        return;
    }

    // 1. Hide all panels and deactivate all nav buttons (including the old active one)
    PANEL_IDS.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('bg-gray-100', 'text-cruk-red', 'border-b-4', 'border-[#E4002B]');
        button.classList.add('text-gray-600', 'hover:bg-gray-50');
    });

    // 2. Show the requested panel
    if (targetPanel) {
        targetPanel.classList.remove('hidden');
    }

    // 3. Activate the corresponding button and update tracker
    if (targetButton) {
        targetButton.classList.add('bg-gray-100', 'text-cruk-red', 'border-b-4', 'border-[#E4002B]'); // Active styling
        targetButton.classList.remove('text-gray-600', 'hover:bg-gray-50'); // Remove inactive styling
        activePanelId = panelId; // Set the new active panel
    }
};

// Function to clear all checkboxes and reset counts
const clearAllFilters = () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    updateCounts(); // This now also clears the chips
    hideActivePanel(); // NEW: Hide panel on clear
    console.log("All filters cleared");
};


// Function to set up the expand/collapse toggles for nested lists
const setupToggles = () => {
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const isExpanded = button.getAttribute('data-expanded') === 'true';

            if (isExpanded) {
                targetElement.style.display = 'none';
                button.setAttribute('data-expanded', 'false');
            } else {
                targetElement.style.display = 'block';
                button.setAttribute('data-expanded', 'true');
            }
        });
    });
};

// Initialize Application
window.onload = function() {
    // Make removeFilter globally accessible for inline onclick
    window.removeFilter = removeFilter;

    renderFilters();
    updateCounts(); // Initialize count and chips
    setupToggles(); // Setup expand/collapse functionality

    // Initial display: Ensure no panel is showing to begin with.
    document.getElementById('cancer-type-panel').classList.add('hidden');
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('bg-gray-100', 'text-cruk-red', 'border-b-4', 'border-[#E4002B]');
        button.classList.add('text-gray-600', 'hover:bg-gray-50');
    });
    activePanelId = null; // Explicitly set to null initially


    // Add event listeners for new navigation buttons
    document.getElementById('nav-cancer').addEventListener('click', () => showPanel('cancer-type-panel'));
    document.getElementById('nav-data').addEventListener('click', () => showPanel('data-type-panel'));
    document.getElementById('nav-access').addEventListener('click', () => showPanel('accessibility-panel'));

    // Add listeners for action buttons to clear filters AND hide panel
    document.getElementById('clear-filters-button').addEventListener('click', clearAllFilters);
    document.getElementById('find-studies-button').addEventListener('click', hideActivePanel); // NEW: Hide panel on submit

    // Add event listeners to all checkboxes for dynamic updating
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        // Ensure updateCounts runs whenever a filter selection changes
        checkbox.addEventListener('change', updateCounts);
    });
};

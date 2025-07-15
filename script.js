document.addEventListener('DOMContentLoaded', () => {
    // Mock Data for 50 Cancer Studies
    const studiesData = [];
    const titles = [
        "Genomic Profiling of Triple-Negative Breast Cancer",
        "AI-Driven Drug Discovery for Pancreatic Cancer",
        "Immunotherapy Response in Lung Cancer Patients",
        "Early Detection Biomarkers for Ovarian Cancer",
        "Personalized Radiation Therapy for Brain Tumors",
        "Epigenetic Modifications in Colon Cancer Progression",
        "Targeting Metabolism in Glioblastoma Multiforme",
        "Circulating Tumor DNA for Disease Monitoring",
        "Novel Therapies for Pediatric Leukemias",
        "Understanding Metastasis in Prostate Cancer",
        "CRISPR-Cas9 Applications in Cancer Gene Editing",
        "Gut Microbiome Influence on Cancer Treatment",
        "Nanoparticle Delivery Systems for Chemotherapy",
        "Patient-Derived Organoids for Drug Screening",
        "Inflammation and Cancer Development",
        "Liquid Biopsies for Early Cancer Recurrence",
        "CAR T-Cell Therapy for Solid Tumors",
        "Exercise Interventions for Cancer Survivors",
        "Nutritional Impact on Cancer Prevention",
        "Psychosocial Support for Cancer Patients",
        "Precision Oncology in Head and Neck Cancer",
        "Radiomics for Predicting Treatment Outcomes",
        "Single-Cell Sequencing in Tumor Heterogeneity",
        "Development of Cancer Vaccines",
        "Role of Telomeres in Cancer Aging",
        "Pharmacogenomics in Cancer Drug Response",
        "Sleep Disturbances in Cancer Patients",
        "Palliative Care Innovations in Oncology",
        "Health Disparities in Cancer Outcomes",
        "Bioinformatics for Cancer Data Integration",
        "Digital Pathology for Cancer Diagnosis",
        "Wearable Devices for Symptom Monitoring",
        "Robotic Surgery Outcomes in Oncology",
        "Gene Therapy for Rare Cancers",
        "Drug Repurposing for Cancer Treatment",
        "Impact of Air Pollution on Cancer Risk",
        "Biomarkers for Chemoresistance in Cancer",
        "Cancer Stem Cell Biology and Therapy",
        "Artificial Pancreas for Diabetes in Cancer",
        "Proton Therapy for Complex Tumors",
        "MicroRNA Profiling in Cancer Detection",
        "Targeting Angiogenesis in Advanced Cancers",
        "Patient Reported Outcomes in Clinical Trials",
        "Ethical Considerations in Cancer Research",
        "Global Cancer Incidence and Mortality Trends",
        "Telemedicine in Oncology Care",
        "Natural Killer Cell Therapies for Leukemia",
        "Impact of Stress on Cancer Progression",
        "AI for Medical Imaging in Oncology",
        "Understanding Cancer Fatigue Mechanisms"
    ];
    const institutes = [
        "Cancer Research Institute", "Global Oncology Center", "Biomedical Research Hub",
        "University Cancer Center", "National Health Institute", "Clinical Trials Unit",
        "Translational Medicine Group", "Genomics Research Lab", "Oncology Innovation Center",
        "Precision Medicine Institute"
    ];

    for (let i = 1; i <= 50; i++) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomInstitute = institutes[Math.floor(Math.random() * institutes.length)];
        const randomDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        studiesData.push({
            id: i,
            studyTitle: `${randomTitle} (Study ${i})`,
            leadResearcherInstitute: `Dr. ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}. ${randomInstitute}`,
            dateAdded: randomDate.toISOString().split('T')[0] // YYYY-MM-DD
        });
    }

    const studiesTableBody = document.getElementById('studies-table-body');
    const searchBar = document.getElementById('search-bar');
    const tableHeaders = document.querySelectorAll('.studies-table th[data-sort]');

    let currentSortColumn = null;
    let currentSortDirection = 'asc'; // 'asc' or 'desc'

    // Function to render the table
    function renderTable(data) {
        studiesTableBody.innerHTML = ''; // Clear existing rows
        data.forEach(study => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${study.studyTitle}</td>
                <td>${study.leadResearcherInstitute}</td>
                <td>${study.dateAdded}</td>
                <td><button class="explore-btn" data-study-id="${study.id}" data-study-title="${study.studyTitle}">Explore</button></td>
            `;
            studiesTableBody.appendChild(row);
        });

        // Add event listeners to new explore buttons
        document.querySelectorAll('.explore-btn').forEach(button => {
            button.addEventListener('click', handleExploreClick);
        });
    }

    // Function to handle explore button click
    function handleExploreClick(event) {
        const studyId = event.target.dataset.studyId;
        const studyTitle = event.target.dataset.studyTitle;
        const options = `
            Options for Study: "${studyTitle}" (ID: ${studyId})
            1. Watch a video
            2. View slides
            3. Add to library
        `;
        alert(options); // Using alert for mock-up
        // In a real application, you would show a modal or navigate
    }

    // Initial render of the table
    renderTable(studiesData);

    // Search functionality
    searchBar.addEventListener('keyup', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredStudies = studiesData.filter(study =>
            study.studyTitle.toLowerCase().includes(searchTerm) ||
            study.leadResearcherInstitute.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredStudies);
    });

    // Table Sorting functionality
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;

            // Reset sort indicators
            tableHeaders.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });

            if (currentSortColumn === column) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortDirection = 'asc';
            }

            // Add active sort class
            header.classList.add(`sort-${currentSortDirection}`);

            const sortedData = [...studiesData].sort((a, b) => {
                let valA = a[column];
                let valB = b[column];

                if (column === 'dateAdded') {
                    valA = new Date(valA);
                    valB = new Date(valB);
                }

                if (valA < valB) {
                    return currentSortDirection === 'asc' ? -1 : 1;
                }
                if (valA > valB) {
                    return currentSortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });
            renderTable(sortedData);
        });
    });

    // Nested filter collapse/expand functionality (basic toggle)
    document.querySelectorAll('.filter-category').forEach(category => {
        category.addEventListener('click', (event) => {
            const nestedList = event.target.nextElementSibling;
            if (nestedList && nestedList.classList.contains('nested-filter-list')) {
                nestedList.style.display = nestedList.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    // Initially hide all nested filter lists except the top level ones
    document.querySelectorAll('.nested-filter-list').forEach(list => {
        // Only hide if it's not a direct child of .filter-list (i.e., deeper nested)
        if (!list.parentElement.classList.contains('filter-list')) {
            list.style.display = 'none';
        }
    });

    // Filter checkbox functionality (for console logging only, no actual filtering implemented yet)
    document.querySelectorAll('.study-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const selectedFilters = Array.from(document.querySelectorAll('.study-filters input[type="checkbox"]:checked'))
                                       .map(cb => cb.value);
            console.log('Selected Filters:', selectedFilters);
            // In a full implementation, you would filter the studiesData array here
            // and then call renderTable(filteredData);
        });
    });
});
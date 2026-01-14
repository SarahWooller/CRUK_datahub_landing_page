import json
import os
import uuid
import random

# -------------------------------------------------------------------------
# 1. CONFIGURATION: Output Directory
# -------------------------------------------------------------------------
OUTPUT_DIR = "generated_datasets"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# -------------------------------------------------------------------------
# 2. FILTER ID MAPPING (Based on your longer_filter_data.js)
# -------------------------------------------------------------------------
FILTERS = {
    # Topography (Site)
    "Brain": "0_0_0_13_2_9",
    "Pancreas": "0_0_0_1_10",
    "Breast": "0_0_0_9",
    "Lung": "0_0_0_2_4",
    "Colon": "0_0_0_1_3",
    "Prostate": "0_0_0_11_1",
    "Kidney": "0_0_0_12_0",
    "Ovary": "0_0_0_10_5",
    "Skin": "0_0_0_8",  # Generic Skin for Melanoma
    "Liver": "0_0_0_1_7",
    "Stomach": "0_0_0_1_1",
    "Bladder": "0_0_0_12_1",

    # Histology (Type)
    "Glioblastoma": "0_0_1_35_28",
    "Adenocarcinoma": "0_0_1_3_0",  # Generic Adeno
    "Ductal_Carcinoma": "0_0_1_8_0",
    "Melanoma": "0_0_1_15",
    "Myeloid_Leukemia": "0_0_1_45_5",
    "DLBCL": "0_0_1_40_21",
    "Medulloblastoma": "0_0_1_35_36",
    "Neuroblastoma": "0_0_1_36_1",
    "RCC": "0_0_1_3_21",  # Renal Cell Carcinoma
    "Squamous": "0_0_1_1_0",

    # Data Types
    "Imaging": "0_2_3_2",
    "MultiOmic": "0_2_3_4",
    "Clinical": "0_2_3_6",  # Clinical Trial / Study
    "Samples": "0_2_0",
    "Longitudinal": "0_2_3_3",
    "Treatment": "0_2_3_5",

    # Access
    "Open": "0_1_4",
    "Collaborative": "0_1_3"
}

# -------------------------------------------------------------------------
# 3. DATASET DEFINITIONS (The 20 Diverse Datasets)
# -------------------------------------------------------------------------
datasets_info = [
    {
        "title": "Longitudinal Glioblastoma Multiforme (GBM) MRI and Survival Cohort",
        "abstract": "A retrospective longitudinal collection of multi-parametric MRI scans from 450 patients diagnosed with Glioblastoma Multiforme (WHO Grade IV). Linked with genomic biomarkers (IDH1, MGMT) and survival outcomes.",
        "filters": ["Brain", "Glioblastoma", "Imaging", "Longitudinal", "Open"]
    },
    {
        "title": "Pancreatic Ductal Adenocarcinoma (PDAC) Proteomics Landscape",
        "abstract": "Mass-spectrometry based proteomics analysis of 200 resected PDAC tumor samples compared with adjacent normal tissue. Includes detailed clinical staging and chemotherapy response data.",
        "filters": ["Pancreas", "Adenocarcinoma", "MultiOmic", "Samples", "Open"]
    },
    {
        "title": "Triple-Negative Breast Cancer (TNBC) Transcriptomics",
        "abstract": "Whole transcriptome sequencing (RNA-Seq) of 500 TNBC core biopsies collected prior to neoadjuvant chemotherapy. Correlated with Pathological Complete Response (pCR) rates.",
        "filters": ["Breast", "Ductal_Carcinoma", "MultiOmic", "Treatment", "Collaborative"]
    },
    {
        "title": "Metastatic Melanoma Immunotherapy Response Registry",
        "abstract": "Real-world data on 1200 patients with metastatic melanoma treated with checkpoint inhibitors (anti-PD1/CTLA4). Includes progression-free survival and immune-related adverse events.",
        "filters": ["Skin", "Melanoma", "Clinical", "Treatment", "Open"]
    },
    {
        "title": "Early-Stage Non-Small Cell Lung Cancer (NSCLC) CT Imaging",
        "abstract": "High-resolution CT imaging dataset of 800 Stage I-II NSCLC patients. Includes radiomic feature extractions and annotated nodule segmentations.",
        "filters": ["Lung", "Squamous", "Imaging", "Clinical", "Open"]
    },
    {
        "title": "Colorectal Cancer Liver Metastases (CRLM) Surgical Outcomes",
        "abstract": "Clinical outcome data for 1500 patients undergoing liver resection for colorectal metastases. Variables include margin status, recurrence patterns, and 5-year survival.",
        "filters": ["Colon", "Liver", "Adenocarcinoma", "Clinical", "Treatment", "Open"]
    },
    {
        "title": "Prostate Cancer Active Surveillance MRI Cohort",
        "abstract": "Longitudinal multiparametric MRI data for 600 men on active surveillance for low-to-intermediate risk prostate cancer. Includes biopsy Gleason scores and PSA kinetics.",
        "filters": ["Prostate", "Adenocarcinoma", "Imaging", "Longitudinal", "Open"]
    },
    {
        "title": "Acute Myeloid Leukemia (AML) Minimal Residual Disease Flow Cytometry",
        "abstract": "Raw flow cytometry files for MRD assessment in 300 AML patients at post-induction and post-consolidation timepoints. Linked to cytogenetic risk groups.",
        "filters": ["Myeloid_Leukemia", "MultiOmic", "Samples", "Treatment", "Collaborative"]
    },
    {
        "title": "Diffuse Large B-Cell Lymphoma (DLBCL) PET-CT Staging",
        "abstract": "Baseline and interim PET-CT scans for 400 DLBCL patients treated with R-CHOP. Includes Deauville scores and metabolic tumor volume calculations.",
        "filters": ["DLBCL", "Imaging", "Clinical", "Treatment", "Open"]
    },
    {
        "title": "Pediatric Medulloblastoma Methylation Classifier Data",
        "abstract": "Genome-wide DNA methylation profiling of 250 pediatric medulloblastoma samples. Used to define molecular subgroups (WNT, SHH, Group 3, Group 4).",
        "filters": ["Brain", "Medulloblastoma", "MultiOmic", "Samples", "Collaborative"]
    },
    {
        "title": "High-Risk Neuroblastoma Genomic Variants (WGS)",
        "abstract": "Whole Genome Sequencing data from 150 high-risk neuroblastoma cases. Focus on MYCN amplification status, ALK mutations, and chromosomal segmental alterations.",
        "filters": ["Neuroblastoma", "MultiOmic", "Samples", "Clinical", "Open"]
    },
    {
        "title": "National Mammography Screening Database: Interval Cancers",
        "abstract": "Anonymised screening mammograms from 50,000 women, highlighting interval cancers detected between screening rounds. Includes radiologist density scores.",
        "filters": ["Breast", "Imaging", "Longitudinal", "Open"]
    },
    {
        "title": "Lung Cancer Screening Low-Dose CT (LDCT) Cohort",
        "abstract": "LDCT scans from a pilot screening program in high-risk areas. Includes follow-up data on nodule management and lung cancer diagnosis rates.",
        "filters": ["Lung", "Imaging", "Clinical", "Open"]
    },
    {
        "title": "Pan-Cancer Whole Genome Sequencing (WGS) of Metastasis",
        "abstract": "WGS data from metastatic biopsy sites across 20 different solid tumor types. Focus on mutational signatures and structural variants driving metastasis.",
        "filters": ["Lung", "Breast", "Colon", "MultiOmic", "Samples", "Collaborative"]
    },
    {
        "title": "Circulating Tumor DNA (ctDNA) in Colorectal Cancer",
        "abstract": "Serial plasma ctDNA analysis in Stage II/III colorectal cancer patients post-surgery. Correlated with radiological recurrence and adjuvant therapy benefit.",
        "filters": ["Colon", "Adenocarcinoma", "MultiOmic", "Longitudinal", "Open"]
    },
    {
        "title": "Primary Care Referrals for Suspected Cancer (Two-Week Wait)",
        "abstract": "EHR extract of 10,000 urgent cancer referrals from GP practices. Tracks conversion rates to cancer diagnosis and time-to-treatment intervals.",
        "filters": ["Clinical", "Longitudinal", "Open"]
    },
    {
        "title": "HES Linked to SACT: Breast Cancer Outcomes",
        "abstract": "Hospital Episode Statistics linked to Systemic Anti-Cancer Therapy datasets for national breast cancer cohort. Analysis of readmission rates and toxicity.",
        "filters": ["Breast", "Clinical", "Treatment", "Longitudinal", "Open"]
    },
    {
        "title": "Ovarian Cancer Ascites Metabolomics",
        "abstract": "NMR-based metabolomic profiling of ascites fluid from 100 ovarian cancer patients. Identification of metabolic signatures associated with platinum resistance.",
        "filters": ["Ovary", "Adenocarcinoma", "MultiOmic", "Samples", "Open"]
    },
    {
        "title": "Renal Cell Carcinoma (RCC) Histopathology WSI",
        "abstract": "Whole Slide Images (H&E stained) of 300 clear cell RCC nephrectomy specimens. Annotated for nuclear grade and necrosis.",
        "filters": ["Kidney", "RCC", "Imaging", "Samples", "Open"]
    },
    {
        "title": "Bladder Cancer Cystoscopy and Recurrence Registry",
        "abstract": "Registry data tracking recurrence patterns in non-muscle invasive bladder cancer. Includes frequency of cystoscopy and intravesical therapy details.",
        "filters": ["Bladder", "Clinical", "Longitudinal", "Treatment", "Open"]
    }
]


# -------------------------------------------------------------------------
# 4. BASE TEMPLATE (Minified for brevity, populated dynamically)
# -------------------------------------------------------------------------
def create_dataset_json(info, index):
    # Map friendly filter names to IDs
    mapped_filters = [FILTERS.get(f) for f in info['filters'] if FILTERS.get(f)]
    # Ensure unique IDs exist for valid schema validation
    # Add generic Topo/Histo/DataType/Access if missing to pass validation
    if not any(f.startswith("0_0_0") for f in mapped_filters): mapped_filters.append("0_0_0_1_1")  # Default Stomach
    if not any(f.startswith("0_0_1") for f in mapped_filters): mapped_filters.append("0_0_1_1_0")  # Default Squamous
    if not any(f.startswith("0_2") for f in mapped_filters): mapped_filters.append("0_2_3_6")  # Default Clinical
    if not any(f.startswith("0_1") for f in mapped_filters): mapped_filters.append("0_1_4")  # Default Open

    return {
        "identifier": str(uuid.uuid4()),
        "version": "1.0.0",
        "revisions": [],
        "issued": "2024-01-01T00:00:00.000Z",
        "modified": "2024-01-01T00:00:00.000Z",
        "summary": {
            "title": info['title'],
            "abstract": info['abstract'],
            "dataCustodian": {
                "identifier": "https://ror.org/example",
                "name": "Generated Research Institute",
                "contactPoint": "access@example.org"
            },
            "funders": "CRUK\nNIHR",
            "grantNumbers": f"GRANT-{index}-2024",
            "populationSize": random.randint(100, 5000),
            "keywords": info['title'].split()[:5],
            "doiName": f"10.1000/data.{index}",
            "contactPoint": "access@example.org"
        },
        "documentation": {
            "description": info['abstract'] + " This is a dummy description generated for testing purposes.",
            "inPipeline": "Available"
        },
        "coverage": {
            "spatial": "United Kingdom",
            "followUp": "1 - 10 Years"
        },
        "provenance": {
            "origin": {
                "purpose": ["Study"],
                "datasetType": ["Health and disease"]
            },
            "temporal": {
                "publishingFrequency": "Annual",
                "startDate": "2020-01-01",
                "timeLag": "1-2 months"
            }
        },
        "accessibility": {
            "usage": {"dataUseLimitation": ["General research use"]},
            "access": {
                "accessRights": "Open access upon request.",
                "jurisdiction": ["GB-ENG"]
            },
            "formatAndStandards": {
                "vocabularyEncodingScheme": ["ICD10"],
                "conformsTo": ["OMOP"],
                "language": ["en"],
                "format": ["text/csv"]
            }
        },
        "observations": [
            {
                "observedNode": "Persons",
                "measuredValue": random.randint(100, 5000),
                "observationDate": "2023-12-31",
                "measuredProperty": "Count"
            }
        ],
        "demographicFrequency": {
            "age": [{"bin": "50-54 years", "count": 10}, {"bin": "55-59 years", "count": 20}],
            "ethnicity": [{"bin": "White - British", "count": 25}, {"bin": "Not stated", "count": 5}]
        },
        "datasetFilters": mapped_filters
    }


# -------------------------------------------------------------------------
# 5. EXECUTION LOOP
# -------------------------------------------------------------------------
def main():
    print(f"Generating {len(datasets_info)} datasets in '{OUTPUT_DIR}'...")

    for i, info in enumerate(datasets_info):
        data = create_dataset_json(info, i + 1)
        filename = f"dataset_{i + 1:02d}.json"
        filepath = os.path.join(OUTPUT_DIR, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

        print(f"  [OK] Created {filename}: {info['title'][:40]}...")

    print("\nDone! You can now upload these files.")


if __name__ == "__main__":
    main()
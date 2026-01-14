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
# 2. FILTER ID MAPPING (Updated with CRUK & TCGA)
# -------------------------------------------------------------------------
FILTERS = {
    # --- Topography (Site) ---
    "Brain": "0_0_0_13_2_9",
    "Pancreas": "0_0_0_1_10",
    "Breast": "0_0_0_9",
    "Lung": "0_0_0_2_4",
    "Colon": "0_0_0_1_3",
    "Prostate": "0_0_0_11_1",
    "Kidney": "0_0_0_12_0",
    "Ovary": "0_0_0_10_5",
    "Skin": "0_0_0_8",
    "Liver": "0_0_0_1_7",
    "Stomach": "0_0_0_1_1",
    "Bladder": "0_0_0_12_1",

    # --- Histology (Type) ---
    "Glioblastoma": "0_0_1_35_28",
    "Adenocarcinoma": "0_0_1_3_0",
    "Ductal_Carcinoma": "0_0_1_8_0",
    "Melanoma": "0_0_1_15",
    "Myeloid_Leukemia": "0_0_1_45_5",
    "DLBCL": "0_0_1_40_21",
    "Medulloblastoma": "0_0_1_35_36",
    "Neuroblastoma": "0_0_1_36_1",
    "RCC": "0_0_1_3_21",
    "Squamous": "0_0_1_1_0",

    # --- Data Types ---
    "Imaging": "0_2_3_2",
    "MultiOmic": "0_2_3_4",
    "Clinical": "0_2_3_6",
    "Samples": "0_2_0",
    "Longitudinal": "0_2_3_3",
    "Treatment": "0_2_3_5",

    # --- Access ---
    "Open": "0_1_4",
    "Collaborative": "0_1_3",

    # --- CRUK Specific Filters (0_0_2_X) ---
    "CRUK_Brain": "0_0_2_13",
    "CRUK_Pancreas": "0_0_2_75",
    "CRUK_Breast": "0_0_2_15",
    "CRUK_Lung": "0_0_2_51",
    "CRUK_Bowel": "0_0_2_12",  # or Colorectal 0_0_2_29
    "CRUK_Prostate": "0_0_2_81",
    "CRUK_AML": "0_0_2_3",
    "CRUK_Lymphoma": "0_0_2_53",  # General Lymphoma
    "CRUK_NHL": "0_0_2_70",  # Non-Hodgkin
    "CRUK_Children": "0_0_2_24",
    "CRUK_Neuroblastoma": "0_0_2_67",
    "CRUK_Melanoma": "0_0_2_56",
    "CRUK_Ovarian": "0_0_2_74",
    "CRUK_Kidney": "0_0_2_46",
    "CRUK_Bladder": "0_0_2_9",
    "CRUK_Liver": "0_0_2_50",

    # --- TCGA Specific Filters (0_0_4_X) ---
    "TCGA_GBM": "0_0_4_10",  # Glioblastoma
    "TCGA_LGG": "0_0_4_17",  # Low Grade Glioma
    "TCGA_PAAD": "0_0_4_24",  # Pancreas
    "TCGA_BRCA": "0_0_4_2",  # Breast
    "TCGA_SKCM": "0_0_4_29",  # Melanoma
    "TCGA_LUAD": "0_0_4_19",  # Lung Adeno
    "TCGA_LUSC": "0_0_4_20",  # Lung Squamous
    "TCGA_COAD": "0_0_4_6",  # Colon
    "TCGA_READ": "0_0_4_27",  # Rectum
    "TCGA_PRAD": "0_0_4_26",  # Prostate
    "TCGA_LAML": "0_0_4_15",  # AML
    "TCGA_DLBC": "0_0_4_7",  # DLBCL
    "TCGA_OV": "0_0_4_23",  # Ovarian
    "TCGA_KIRC": "0_0_4_13",  # Kidney Clear Cell
    "TCGA_BLCA": "0_0_4_1",  # Bladder
    "TCGA_LIHC": "0_0_4_18"  # Liver
}

# -------------------------------------------------------------------------
# 3. DATASET DEFINITIONS
# -------------------------------------------------------------------------
datasets_info = [
    {
        "title": "Longitudinal Glioblastoma Multiforme (GBM) MRI and Survival Cohort",
        "custodian": "Neuro-Oncology Imaging Archive",
        "abstract": "A retrospective longitudinal collection of multi-parametric MRI scans from 450 patients diagnosed with Glioblastoma Multiforme (WHO Grade IV). Linked with genomic biomarkers (IDH1, MGMT) and survival outcomes.",
        "filters": ["Brain", "Glioblastoma", "Imaging", "Longitudinal", "Open", "CRUK_Brain", "TCGA_GBM"]
    },
    {
        "title": "Pancreatic Ductal Adenocarcinoma (PDAC) Proteomics Landscape",
        "custodian": "Pancreatic Cancer Research Fund Tissue Bank",
        "abstract": "Mass-spectrometry based proteomics analysis of 200 resected PDAC tumor samples compared with adjacent normal tissue. Includes detailed clinical staging and chemotherapy response data.",
        "filters": ["Pancreas", "Adenocarcinoma", "MultiOmic", "Samples", "Open", "CRUK_Pancreas", "TCGA_PAAD"]
    },
    {
        "title": "Triple-Negative Breast Cancer (TNBC) Transcriptomics",
        "custodian": "BREAST-PREDICT Consortium",
        "abstract": "Whole transcriptome sequencing (RNA-Seq) of 500 TNBC core biopsies collected prior to neoadjuvant chemotherapy. Correlated with Pathological Complete Response (pCR) rates.",
        "filters": ["Breast", "Ductal_Carcinoma", "MultiOmic", "Treatment", "Collaborative", "CRUK_Breast", "TCGA_BRCA"]
    },
    {
        "title": "Metastatic Melanoma Immunotherapy Response Registry",
        "custodian": "Melanoma Focus Registry",
        "abstract": "Real-world data on 1200 patients with metastatic melanoma treated with checkpoint inhibitors (anti-PD1/CTLA4). Includes progression-free survival and immune-related adverse events.",
        "filters": ["Skin", "Melanoma", "Clinical", "Treatment", "Open", "CRUK_Melanoma", "TCGA_SKCM"]
    },
    {
        "title": "Early-Stage Non-Small Cell Lung Cancer (NSCLC) CT Imaging",
        "custodian": "National Lung Matrix Trial Repository",
        "abstract": "High-resolution CT imaging dataset of 800 Stage I-II NSCLC patients. Includes radiomic feature extractions and annotated nodule segmentations.",
        "filters": ["Lung", "Squamous", "Imaging", "Clinical", "Open", "CRUK_Lung", "TCGA_LUSC"]
    },
    {
        "title": "Colorectal Cancer Liver Metastases (CRLM) Surgical Outcomes",
        "custodian": "Liver Metastasis Surgical Registry (LiMSR)",
        "abstract": "Clinical outcome data for 1500 patients undergoing liver resection for colorectal metastases. Variables include margin status, recurrence patterns, and 5-year survival.",
        "filters": ["Colon", "Liver", "Adenocarcinoma", "Clinical", "Treatment", "Open", "CRUK_Bowel", "CRUK_Liver",
                    "TCGA_COAD", "TCGA_LIHC"]
    },
    {
        "title": "Prostate Cancer Active Surveillance MRI Cohort",
        "custodian": "Prostate Cancer UK Active Surveillance Cohort",
        "abstract": "Longitudinal multiparametric MRI data for 600 men on active surveillance for low-to-intermediate risk prostate cancer. Includes biopsy Gleason scores and PSA kinetics.",
        "filters": ["Prostate", "Adenocarcinoma", "Imaging", "Longitudinal", "Open", "CRUK_Prostate", "TCGA_PRAD"]
    },
    {
        "title": "Acute Myeloid Leukemia (AML) Minimal Residual Disease Flow Cytometry",
        "custodian": "Haematological Malignancy Research Network (HMRN)",
        "abstract": "Raw flow cytometry files for MRD assessment in 300 AML patients at post-induction and post-consolidation timepoints. Linked to cytogenetic risk groups.",
        "filters": ["Myeloid_Leukemia", "MultiOmic", "Samples", "Treatment", "Collaborative", "CRUK_AML", "TCGA_LAML"]
    },
    {
        "title": "Diffuse Large B-Cell Lymphoma (DLBCL) PET-CT Staging",
        "custodian": "PET-PANC Collaborative",
        "abstract": "Baseline and interim PET-CT scans for 400 DLBCL patients treated with R-CHOP. Includes Deauville scores and metabolic tumor volume calculations.",
        "filters": ["DLBCL", "Imaging", "Clinical", "Treatment", "Open", "CRUK_NHL", "CRUK_Lymphoma", "TCGA_DLBC"]
    },
    {
        "title": "Pediatric Medulloblastoma Methylation Classifier Data",
        "custodian": "Children's Cancer and Leukaemia Group (CCLG)",
        "abstract": "Genome-wide DNA methylation profiling of 250 pediatric medulloblastoma samples. Used to define molecular subgroups (WNT, SHH, Group 3, Group 4).",
        "filters": ["Brain", "Medulloblastoma", "MultiOmic", "Samples", "Collaborative", "CRUK_Children", "CRUK_Brain"]
    },
    {
        "title": "High-Risk Neuroblastoma Genomic Variants (WGS)",
        "custodian": "Neuroblastoma UK Genomic Database",
        "abstract": "Whole Genome Sequencing data from 150 high-risk neuroblastoma cases. Focus on MYCN amplification status, ALK mutations, and chromosomal segmental alterations.",
        "filters": ["Neuroblastoma", "MultiOmic", "Samples", "Clinical", "Open", "CRUK_Children", "CRUK_Neuroblastoma"]
    },
    {
        "title": "National Mammography Screening Database: Interval Cancers",
        "custodian": "NBSS Research Unit",
        "abstract": "Anonymised screening mammograms from 50,000 women, highlighting interval cancers detected between screening rounds. Includes radiologist density scores.",
        "filters": ["Breast", "Imaging", "Longitudinal", "Open", "CRUK_Breast", "TCGA_BRCA"]
    },
    {
        "title": "Lung Cancer Screening Low-Dose CT (LDCT) Cohort",
        "custodian": "SUMMIT Study Group",
        "abstract": "LDCT scans from a pilot screening program in high-risk areas. Includes follow-up data on nodule management and lung cancer diagnosis rates.",
        "filters": ["Lung", "Imaging", "Clinical", "Open", "CRUK_Lung", "TCGA_LUAD"]
    },
    {
        "title": "Pan-Cancer Whole Genome Sequencing (WGS) of Metastasis",
        "custodian": "Hartwig Medical Foundation (UK Node)",
        "abstract": "WGS data from metastatic biopsy sites across 20 different solid tumor types. Focus on mutational signatures and structural variants driving metastasis.",
        "filters": ["Lung", "Breast", "Colon", "MultiOmic", "Samples", "Collaborative", "CRUK_Lung", "CRUK_Breast",
                    "CRUK_Bowel"]
    },
    {
        "title": "Circulating Tumor DNA (ctDNA) in Colorectal Cancer",
        "custodian": "FOCUS4 Trial Management Group",
        "abstract": "Serial plasma ctDNA analysis in Stage II/III colorectal cancer patients post-surgery. Correlated with radiological recurrence and adjuvant therapy benefit.",
        "filters": ["Colon", "Adenocarcinoma", "MultiOmic", "Longitudinal", "Open", "CRUK_Bowel", "TCGA_COAD"]
    },
    {
        "title": "Primary Care Referrals for Suspected Cancer (Two-Week Wait)",
        "custodian": "National Cancer Diagnosis Audit (NCDA)",
        "abstract": "EHR extract of 10,000 urgent cancer referrals from GP practices. Tracks conversion rates to cancer diagnosis and time-to-treatment intervals.",
        "filters": ["Clinical", "Longitudinal", "Open"]
    },
    {
        "title": "HES Linked to SACT: Breast Cancer Outcomes",
        "custodian": "Public Health England (NCRAS)",
        "abstract": "Hospital Episode Statistics linked to Systemic Anti-Cancer Therapy datasets for national breast cancer cohort. Analysis of readmission rates and toxicity.",
        "filters": ["Breast", "Clinical", "Treatment", "Longitudinal", "Open", "CRUK_Breast"]
    },
    {
        "title": "Ovarian Cancer Ascites Metabolomics",
        "custodian": "Ovarian Cancer Action Research Centre",
        "abstract": "NMR-based metabolomic profiling of ascites fluid from 100 ovarian cancer patients. Identification of metabolic signatures associated with platinum resistance.",
        "filters": ["Ovary", "Adenocarcinoma", "MultiOmic", "Samples", "Open", "CRUK_Ovarian", "TCGA_OV"]
    },
    {
        "title": "Renal Cell Carcinoma (RCC) Histopathology WSI",
        "custodian": "Kidney Cancer UK Biobank",
        "abstract": "Whole Slide Images (H&E stained) of 300 clear cell RCC nephrectomy specimens. Annotated for nuclear grade and necrosis.",
        "filters": ["Kidney", "RCC", "Imaging", "Samples", "Open", "CRUK_Kidney", "TCGA_KIRC"]
    },
    {
        "title": "Bladder Cancer Cystoscopy and Recurrence Registry",
        "custodian": "Action Bladder Cancer UK",
        "abstract": "Registry data tracking recurrence patterns in non-muscle invasive bladder cancer. Includes frequency of cystoscopy and intravesical therapy details.",
        "filters": ["Bladder", "Clinical", "Longitudinal", "Treatment", "Open", "CRUK_Bladder", "TCGA_BLCA"]
    }
]


# -------------------------------------------------------------------------
# 4. BASE TEMPLATE GENERATOR
# -------------------------------------------------------------------------
def create_dataset_json(info, index):
    # Map friendly filter names to IDs
    mapped_filters = [FILTERS.get(f) for f in info['filters'] if FILTERS.get(f)]

    # Ensure mandatory fields are present for validation if missing
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
                "identifier": f"https://ror.org/custodian-{index}",
                "name": info['custodian'],
                "contactPoint": f"access@custodian-{index}.org"
            },
            "funders": "CRUK\nNIHR",
            "grantNumbers": f"GRANT-{index}-2024",
            "populationSize": random.randint(100, 5000),
            "keywords": info['title'].split()[:5],
            "doiName": f"10.1000/data.{index}",
            "contactPoint": f"access@custodian-{index}.org"
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
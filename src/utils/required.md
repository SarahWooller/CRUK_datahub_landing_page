# DataSchema Requirements

## Required Sections

### identifier (Required Section)
*Primitive value (No sub-fields)*

---

### version (Required Section)
*Primitive value (No sub-fields)*

---

### revisions (Required Section)
**Required Fields:**
- version (Version number used for previous version of this dataset)

**Optional Fields:**
- url (Some url with a reference to the record of a previous version of this dataset)

---

### issued (Required Section)
*Primitive value (No sub-fields)*

---

### modified (Required Section)
*Primitive value (No sub-fields)*

---

### summary (Required Section)
**Required Fields:**
- title (Up to 150 characters.)
- abstract (Optimal length one paragraph. Limited to 255 characters. Avoid long sentences and abbreviations.)
- dataCustodian (Organisation responsible for queries and data access requests.)
- populationSize (Input the number of people captured within the dataset. Defaults to 0.)
- contactPoint (Email address for coordinating data access requests.)

**Optional Fields:**
- keywords (Include as a minimum any medications tested in clinical trial, any specific gene mutations researched, the status of cancer if appropriate, and male/female for single sex study.  Keywords or short phrases improve search engine optimisation.)
- doiName (DOI associated to this dataset. Find out more about DOIs here: [https://www.doi.org/the-identifier/what-is-a-doi/](https://www.doi.org/the-identifier/what-is-a-doi/))
- datasetAliases (Dataset & BioSample alias or alternate names.)
- leadResearcher (Lead for the dataset. This need not be the same as the lead for the underlying grant)
- leadResearchInstitute (No description provided)

---

### accessibility (Required Section)
**Required Fields:**
- access (Accessibility information allows researchers to understand access, usage, limitations, formats, standards and linkage or interoperability with toolsets.)

**Optional Fields:**
- usage (This section includes information about how the data can be used and how it is currently being used.)
- formatAndStandards (Section includes technical attributes for language vocabularies, sizes etc. and gives researchers facts about and processing the underlying data in the dataset.)

---

### observations (Required Section)
**Required Fields:**
- observedNode (Please select one of the following broad notes for your measured observation. Indicating whether the measured property is a recording of unique persons, events, findings or scans per modality.)
- measuredValue (An integer value size of the measured property, such as ‘1000’ for 1000 people in the study or ‘87’ for 87 MRI scans in the dataset.)
- observationDate (Provide the date, or datetime that the observation was made. Multiple observations of the same property can be provided, for example an observation of cumulative COVID positive cases by specimen on the 1/1/2021 with a measuredValue of 2000000, and a second observation entry on 8/2/2021 recording a measuredValue of as 3100000.)
- measuredProperty (Descriptive term for the observation property measured. For example, people, procedures, x-rays, or diagnosis of type 1 diabetes. This could also be a specific SNOMED CT term.)

**Optional Fields:**
- disambiguatingDescription (If required, please provide additional details that help distinguish between similar measured properties within your dataset, for example this is useful when SNOMED CT terms do not provide sufficient detail to distinguish between parts of the dataset population. Limited to 500 characters.)

---

## Optional Sections

### documentation (Optional Section)
**Required Fields (if you choose to include this section):**
- description (Free-text description of the dataset.)

**Optional Fields:**
- associatedMedia (Url linking to associated media. Note: media asset can be hosted by the organisation or uploaded using the onboarding portal.)
- inPipeline (Indicate whether this dataset is currently available for Researchers to request access.)

---

### coverage (Optional Section)
*No fields are strictly required in this section.*

**Optional Fields:**
- spatial (The geographical area covered by the dataset. It is recommended that links are to entries in one of the recommended standards:\n- For locations in the UK: [ONS standards](https://geoportal.statistics.gov.uk/datasets/208d9884575647c29f0dd5a1184e711a/about)\n- For locations in other countries: [ISO 3166-1 & ISO 3166-2](https://github.com/HDRUK/reference-codes))
- typicalAgeRangeMin (Please indicate the minimum age in years of participants in the dataset as a whole number (integer).)
- typicalAgeRangeMax (Please indicate the maximum age in years of participants in the dataset as a whole number (integer).)
- datasetCompleteness (The URL where a Researcher can learn more about the completeness of the dataset.)
- materialType (The type of biospecimen saved from a biological entity.)
- followUp (If known, what is the typical time span that a patient appears in the dataset (follow up period). In a prospective cohort study, after baseline information is collected, participants are followed “longitudinally” i.e. new information is collected about them for a period of time afterward. This is known as the “follow up period”. What is the typical time span of follow up, e.g. 1 year, 5 years? If there are multiple cohorts in the dataset with varying follow up periods, please provide the longest follow up period.)
- pathway (Please indicate if the dataset is representative of the patient pathway and any limitations the dataset may have with respect to pathway coverage. This could include if the dataset is from a single speciality or area, a single tier of care, linked across two tiers (e.g. primary and secondary care), or an integrated care record covering the whole patient pathway.)

---

### provenance (Optional Section)
*No fields are strictly required in this section.*

**Optional Fields:**
- origin (Coverage by origin (geographical and situations).)
- temporal (Dates and other temporal coverage information.)

---

### enrichmentAndLinkage (Optional Section)
*No fields are strictly required in this section.*

**Optional Fields:**
- derivedFrom (If applicable, please provide DOIs or links to datasets from which data in this dataset has been derived or calculated from.)
- isPartOf (This relationship indicates that the dataset is a component or subset of a broader collection of related datasets. For example, clinical trial data for a specific drug may be part of a larger database of pharmaceutical research data. Complete only if the dataset is part of a group or family of datasets i.e. Hospital Episode Statistics has several constituents. If your dataset is not part of a group, please enter “NOT APPLICABLE” **Example**: Hospital Episodes Statistics datasets (A&E, APC, OP, AC MSDS).)
- linkableDatasets (If applicable, please provide the DOI of other datasets that have previously been linked to this dataset and their availability. If no DOI is available, please provide the title of the datasets that can be linked.)
- similarToDatasets (Datasets that are similar to each other in some way, collect similar patients, regional equivalent etc.)
- investigations (Please provide link to any active projects that are using the dataset.)
- tools (Please provide the URL of any analysis tools or models that have been created for this dataset and are available for further use. Multiple tools may be provided. Note: We encourage users to adopt a model along the lines of https://www.ga4gh.org/news/tool-registry-service-api-enabling-an-interoperable-library-of-genomics-analysis-tools/)
- publicationAboutDataset (DOIs for publications which describe the dataset.)
- publicationUsingDataset (DOIs for publications which use the dataset for analysis.)

---

### structuralMetadata (Optional Section)
*No fields are strictly required in this section.*

**Optional Fields:**
- tables (Tables in the dataset)
- syntheticDataWebLink (Artificial datasets that share the properties of the original data but contain no sensitive information can be very useful for researchers wishing to explore the properties of a dataset, and can be generated using entirely local solutions such as python's Synthetic Data Vault. Please provide the website address(es) with information on any related synthetic datasets.)

---

### demographicFrequency (Optional Section)
*No fields are strictly required in this section.*

**Optional Fields:**
- age (Array of bins, based off the UK Office for National Statistics (ONS) groupings, and their corresponding counts as represented within the dataset.)
- ethnicity (Array of bins, based off the UK Office for National Statistics (ONS) census groupings, and their corresponding counts as represented within the dataset.)
- disease (Array of health conditions or diseases (based around ICD-10, SNOMED CT and MeSH disease vocabularies) and their corresponding counts as represented within the dataset.)

---

### omics (Optional Section)
*No fields are strictly required in this section.*

**Optional Fields:**
- assay (The specific 'omics assay that generated the dataset.)
- platform (The specific technology or infrastructure used to perform the assay. If the omics platform used to create your dataset is not listed, please select other, a member of the gateway team will contact you to add an appropriate term(s) both to your record and to the metadata schema on your behalf.)

---

### datasetFilters (Optional Section)
*Primitive value (No sub-fields)*

---

### icons (Optional Section)
*Primitive value (No sub-fields)*

---

### erd (Optional Section)
*Primitive value (No sub-fields)*

---

### projectGrants (Optional Section)
*Primitive value (No sub-fields)*

---

### otherDataTypes (Optional Section)
*Primitive value (No sub-fields)*

---

### welcome (Optional Section)
*Primitive value (No sub-fields)*

---

### project (Optional Section)
*Primitive value (No sub-fields)*

---


# DataSchema Requirements

Based on the `semanticSchema.json` overriding the base `schema.json`, the following entries are strictly required.

## 1. Root Level Required Fields

### identifier
*Primitive value (string)*
- Unique dataset identifier (e.g. UUID).

### version
*Primitive value (string)*
- Semantic Versioning (e.g., "1.0.0").

### revisions
*Array of objects*
**Required Sub-fields in each object:**
- `version`: Version number used for a previous version of this dataset.

### issued
*Primitive value (string)*
- Date-time string indicating when the dataset was issued.

### modified
*Primitive value (string)*
- Date-time string indicating when the dataset was last modified.

### summary
*Object*
**Required Sub-fields:**
- `title`: String (Up to 150 characters).
- `abstract`: String (Optimal length one paragraph, max 255 characters).
- `dataCustodian`: Object (`Organisation` $ref). Must include:
  - `identifier`: String (e.g. ROR URI).
  - `name`: String (Organisation name).
  - `contactPoint`: String (Email address).
- `populationSize`: Integer (Number of people/samples captured).
- `contactPoint`: String (Email address for coordinating data access requests).

### accessibility
*Object*
**Required Sub-fields:**
- `access`: Object (`Access` $ref). Must include:
  - `accessRights`: String/Description detailing the data access rights and how to request access.

---

## 2. Optional Fields (Frequently Used)

While not strictly required at the root level by the `semanticSchema.json`, the following fields are highly recommended for robust dataset descriptions:

### observations
*Array of Objects*
- `observedNode`: String (e.g. "Persons", "Events")
- `measuredValue`: Integer (e.g. 1000)
- `observationDate`: String (Date)
- `measuredProperty`: String (e.g. "Count")

### demographicFrequency
*Object*
- Can include `ethnicity` (Array of objects requiring `bin` and `count`).

### structuralMetadata
*Array of Objects*
- `name`: Table name
- `columns`: Array of data columns (requiring `name`)

### otherDataTypes
*Array of Objects*
- `title`: String
- `description`: String
- `format`: String

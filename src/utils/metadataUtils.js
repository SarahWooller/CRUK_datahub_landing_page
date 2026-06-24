export const extractMetadataConstants = (data) => {
  const id = data.id;
  const blob = data.metadata_blob;

  // Safely extract top-level objects from the targeted blob
  const summary = blob?.summary || {};
  const filters = blob?.datasetFilters || [];
  const temporal = blob?.temporal || {};

  // Standard extractions from summary
  const leadResearcher = summary.leadResearcher || null;
  const popSize = summary.populationSize || null;
  const title = summary.title || null;
  const abstract = summary.abstract || null;

  // Accessibility extraction
  const accessFilter = filters.find(f => f.category === "accessType");
  const accessibility = accessFilter ? accessFilter.label : null;

  // Commercial use extraction
  const nonCommercialUseOnly = filters.some(f => f.label === "non-commercial use only") ? "True" : "False";

  // Data Range extraction
  const startYear = temporal.startDate ? temporal.startDate.substring(0, 4) : "";
  const endYear = temporal.endDate ? temporal.endDate.substring(0, 4) : "";
  const dataRange = (startYear && endYear) ? `${startYear} - ${endYear}` : null;

  return {
    id,
    leadResearcher,
    popSize,
    accessibility,
    nonCommercialUseOnly,
    dataRange,
    title,
    abstract
  };
};
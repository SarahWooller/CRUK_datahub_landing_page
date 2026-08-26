import { filterData } from './longer_filter_data.js';
import { flattenedFilterData } from './flattened_filter_data.js';

const filterDetailsMap = new Map(Object.entries(flattenedFilterData));

export { filterDetailsMap, filterData };
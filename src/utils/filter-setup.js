import { filterData } from './longer_filter_data.js';
const filterDetailsMap = new Map();

const populateMap = (nodes, primaryGroup) => {
    if (!nodes) return;
    const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
    nodesArray.forEach(item => {
        const fullId = item.id;
        filterDetailsMap.set(fullId, { id: item.id, label: item.label, category: item.category, group: primaryGroup, });

        if (item.children && Object.keys(item.children).length > 0) {
            populateMap(item.children, primaryGroup);
        }
    });
};
populateMap(filterData['0_0'].children, filterData['0_0'].primaryGroup);
populateMap(filterData['0_2'].children, filterData['0_2'].primaryGroup);
populateMap(filterData['0_1'].children, filterData['0_1'].primaryGroup);

export {filterDetailsMap, filterData}
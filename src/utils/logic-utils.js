import { filterDetailsMap } from './filter-setup.js';

const filterType = (id) => {
    const info = id.split("_");
    if (info.length < 3) return "unknown";

    const first = info[1];
    if (first === "2") {
        return "data"; // 0_2_...
    } else if (first === "1") {
        return "access"; // 0_1_...
    } else {
        // first === "0"
        const second = info[2];
        if (second === "1") {
            return "hist"; // 0_0_1_...
        }
        else if (second === "0") {
            return "top"; // 0_0_0_...
        }
        else if (second === "2") return "cruk";
        else if (second === "3") return "snomed";
        else if (second === "4") return "tcga";
        return "unknown";
    }
};

const includeParents = (f) => {
    if (f) {
        const nms = f.split("_");
        if (nms[1] !== "1" && nms.length > 3) {
            const parents = [];
            for (let k = 4; k <= nms.length; k++) {
                parents.push(nms.slice(0, k).join("_"));
            }
            return parents;
        }
    }
    return [f];
};

const plusParents = (filters) => {
    if (!filters || filters.length === 0) return [];

    const allFilters = new Set();
    filters.forEach(f => {
        includeParents(f).forEach(parentOrSelf => {
            allFilters.add(parentOrSelf);
        });
    });

    return Array.from(allFilters).filter(id => filterDetailsMap.has(id));
};

const getMessage = (thelist, joiner) => {
    const length = thelist.length;
    if (length === 0) {
        return "";
    } else if (length === 1) {
        return filterDetailsMap.get(thelist[0])?.label || "";
    } else {
        const terms = thelist.map(id => filterDetailsMap.get(id)?.label).filter(Boolean);
        return `(${terms.join(` ${joiner} `)})`;
    }
};

const calculateLogicMessage = (filters, filterType, plusParents, includeParents, getMessage) => {
    const hist = filters.filter(f => filterType(f) === "hist");
    const top = filters.filter(f => filterType(f) === "top"
        || filterType(f) === "cruk"
        || filterType(f) === "snomed"
        || filterType(f) === "tcga");
    const data = filters.filter(f => filterType(f) === "data");
    const access = filters.filter(f => filterType(f) === "access");

    const messages = [];

    // HIST message: plus_parents and OR
    const hist_plus = plusParents(hist);
    const hist_message = getMessage(hist_plus, "OR");
    if (hist_message) messages.push(hist_message);

    // TOP/CRUK message: plus_parents and OR
    const top_plus = plusParents(top);
    const top_message = getMessage(top_plus, "OR");
    if (top_message) messages.push(top_message);

    // DATA message: include_parents (individually) and OR, then join groups with AND
    const data_messages = data.map(d => {
        const listWithParents = includeParents(d).filter(id => filterDetailsMap.has(id));
        return getMessage(listWithParents, "OR");
    }).filter(Boolean);

    const data_final_message = data_messages.join(" AND ");
    if (data_final_message) messages.push(data_final_message);

    // ACCESS message: simple list and OR
    const access_message = getMessage(access, "OR");
    if (access_message) messages.push(access_message);

    return messages.join(" AND ");
};

export {
    filterType,
    includeParents,
    plusParents,
    getMessage,
    calculateLogicMessage
};
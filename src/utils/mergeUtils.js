export const deepMerge = (target, source) => {
    if (typeof target !== 'object' || target === null) return source || target;
    if (typeof source !== 'object' || source === null) return target;

    const output = Array.isArray(target) ? [...target] : { ...target };

    Object.keys(source).forEach(key => {
        const targetValue = output[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            output[key] = sourceValue;
        } else if (typeof targetValue === 'object' && typeof sourceValue === 'object') {
            output[key] = deepMerge(targetValue, sourceValue);
        } else {
            output[key] = sourceValue;
        }
    });

    return output;
};

export const isEmpty = (value) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
};
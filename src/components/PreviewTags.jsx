import React, { useMemo } from 'react';
import { normalizeList } from '../utils/metadataUtils';


const PreviewTags = ({ data }) => {
    const keywords = useMemo(() => {
        const rawKeywords = normalizeList(data.summary?.keywords);
        return rawKeywords.filter(kw => kw && kw.trim() !== '');
    }, [data]);

    const derivedFilters = useMemo(() => {
        const filters = {};
        const filterObjects = data.datasetFilters || [];

        filterObjects.forEach(filter => {
            const groupName = filter.primaryGroup || "Other Filters";
            const categoryName = filter.category || "Miscellaneous";

            if (!filters[groupName]) filters[groupName] = {};
            if (!filters[groupName][categoryName]) filters[groupName][categoryName] = [];

            filters[groupName][categoryName].push({
                label: filter.label,
                description: filter.description
            });
        });
        return filters;
    }, [data]);

    return (
        <aside className="w-full h-full bg-white shadow-sm p-4 border border-gray-100 rounded-lg overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">Filters & Tags</h3>

            {/* Keywords */}
            <div className="mb-6">
                <h4 className="font-semibold text-blue-900 mb-2 border-b border-gray-100 pb-1">Keywords</h4>
                <ul className="space-y-1">
                    {keywords.map((kw, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                            {kw}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Filters */}
            <div className="space-y-6">
                {Object.entries(derivedFilters).map(([groupName, categories]) => (
                    <div key={groupName}>
                        <h4 className="font-bold text-blue-900 mb-3 border-b border-gray-200 pb-1 text-base">{groupName}</h4>
                        {Object.entries(categories).map(([categoryName, items]) => (
                            <div key={categoryName} className="mb-4 pl-1">
                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{categoryName}</h5>
                                <ul className="pl-2 border-l-2 border-gray-100 ml-1">
                                    {items.map((filter, idx) => (
                                        <li key={idx} className="mb-2 text-sm group/filter">
                                            <span className="text-gray-800 font-medium block">{filter.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}

                {Object.keys(derivedFilters).length === 0 && (
                    <p className="text-sm text-gray-400 italic">No dataset filters applied.</p>
                )}
            </div>
        </aside>
    );
};

export default PreviewTags;
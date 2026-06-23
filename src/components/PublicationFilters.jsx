import React from 'react';

export default function PublicationFilters({
  searchQuery,
  setSearchQuery,
  selectedDatasets,
  setSelectedDatasets,
  selectedProjects,
  setSelectedProjects,
  availableDatasets,
  availableProjects
}) {

  const handleCheckboxChange = (id, list, setList) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 flex flex-col h-full overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-wide">Filters</h2>

      {/* Text Search Field */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Search Publications
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, DOI, or author..."
            className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Dataset Filter Option */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Filter by Dataset
        </label>
        <div className="bg-white border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
          {availableDatasets.map((dataset) => (
            <label key={dataset.id} className="flex items-start gap-2.5 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedDatasets.includes(dataset.id)}
                onChange={() => handleCheckboxChange(dataset.id, selectedDatasets, setSelectedDatasets)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="leading-tight">{dataset.computed_title}</span>
            </label>
          ))}
          {availableDatasets.length === 0 && (
            <span className="text-xs text-gray-400 italic">No datasets loaded</span>
          )}
        </div>
      </div>

      {/* Project Filter Option */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Filter by Project
        </label>
        <div className="bg-white border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
          {availableProjects.map((project) => (
            <label key={project.id} className="flex items-start gap-2.5 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedProjects.includes(project.id)}
                onChange={() => handleCheckboxChange(project.id, selectedProjects, setSelectedProjects)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="leading-tight">
                {project.projectGrantName || `Project ${project.id}`}
              </span>
            </label>
          ))}
          {availableProjects.length === 0 && (
            <span className="text-xs text-gray-400 italic">No projects loaded</span>
          )}
        </div>
      </div>

      {/* Clear Filters Utility */}
      {(searchQuery || selectedDatasets.length > 0 || selectedProjects.length > 0) && (
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedDatasets([]);
            setSelectedProjects([]);
          }}
          className="mt-auto w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 rounded-md transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
}
import React from 'react';

const ToolCard = ({ tool }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-4 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-baseline">
        <span>{tool.name}</span>
        {tool.url && (
          <a
            href={tool.url.startsWith('http') ? tool.url : `https://${tool.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-normal text-blue-600 hover:underline ml-3"
          >
            (link to external website)
          </a>
        )}
      </h3>

      <div className="text-sm text-gray-600 flex flex-wrap gap-2 mb-4">
        <span className="font-medium">{(tool.associated_authors || []).join(', ') || 'No authors'}</span>
      </div>

      {/* Data Dependencies Section */}
      <div className="bg-gray-50 rounded-md p-4 mb-4 border border-gray-100">
        <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wider mb-2">
          Data Dependencies
        </span>

        {/* Linked Datasets */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700 w-20">Datasets:</span>
          {tool.datasets && tool.datasets.length > 0 ? (
            tool.datasets.map((dataset) => (
              <a
                key={dataset.id}
                href={`/src/meta?id=${dataset.id}`}
                className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md font-medium hover:bg-blue-100 transition-colors"
              >
                {dataset.computed_title || dataset.title || `Dataset ID: ${dataset.id}`}
              </a>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">None linked</span>
          )}
        </div>

        {/* Linked Projects */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 w-20">Projects:</span>
          {tool.projects && tool.projects.length > 0 ? (
            tool.projects.map((project) => (
              <a
                key={project.id}
                href={`/src/project_meta?pid=${project.id}`}
                className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md font-medium hover:bg-purple-100 transition-colors"
              >
                {project.project_grant_name || project.projectGrantName || project.title || `Project ID: ${project.id}`}
              </a>
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">None linked</span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-md p-4 mb-4 border border-gray-100">
        <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wider mb-2">
          Description
        </span>
        <p className="text-sm text-gray-700 line-clamp-3">
            {tool.description || 'No description provided.'}
        </p>
      </div>
    </div>
  );
};

export default function ToolList({ tools }) {
  if (!tools || tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200 shadow-sm">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-900">No tools found</h3>
        <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto pr-4 custom-scrollbar">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}

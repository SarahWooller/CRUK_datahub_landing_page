import React, { useState, useEffect, useMemo } from 'react';
import ToolFilters from './ToolFilters';
import ToolList from './ToolList';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export function ToolDashboard() {
  const [allTools, setAllTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [datasetSearchQuery, setDatasetSearchQuery] = useState('');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tools/`);
        if (!res.ok) throw new Error('Failed to fetch tools');
        const toolsData = await res.json();
        setAllTools(toolsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      // 1. Text Search Filter
      const matchesSearch = searchQuery === '' ||
        (tool.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.associated_authors && tool.associated_authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())));

      // 2. Dataset Search Filter
      const matchesDatasets = datasetSearchQuery === '' ||
        (tool.datasets && tool.datasets.some(ds =>
          (ds.computed_title || ds.title || '').toLowerCase().includes(datasetSearchQuery.toLowerCase())
        ));

      // 3. Project Search Filter
      const matchesProjects = projectSearchQuery === '' ||
        (tool.projects && tool.projects.some(proj =>
          (proj.projectGrantName || proj.title || '').toLowerCase().includes(projectSearchQuery.toLowerCase())
        ));

      return matchesSearch && matchesDatasets && matchesProjects;
    });
  }, [allTools, searchQuery, datasetSearchQuery, projectSearchQuery]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading CRUK datahub tools...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      <ToolFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        datasetSearchQuery={datasetSearchQuery}
        setDatasetSearchQuery={setDatasetSearchQuery}
        projectSearchQuery={projectSearchQuery}
        setProjectSearchQuery={setProjectSearchQuery}
      />
      <div className="flex-1 p-6 bg-gray-50 flex flex-col overflow-hidden">
        <div className="mb-4 flex justify-between items-end">
          <h1 className="text-2xl font-bold text-gray-900">Tools Directory</h1>
          <span className="text-sm text-gray-500 font-medium">
            Showing {filteredTools.length} results
          </span>
        </div>
        <ToolList tools={filteredTools} />
      </div>
    </div>
  );
}

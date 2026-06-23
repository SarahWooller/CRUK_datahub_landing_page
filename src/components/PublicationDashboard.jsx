import React, { useState, useEffect, useMemo } from 'react';
import PublicationFilters from './PublicationFilters';
import PublicationList from './PublicationList';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export function PublicationDashboard() {
  // Master Data State (Fetched from API)
  const [allPublications, setAllPublications] = useState([]);
  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter State (Passed down to PublicationFilters)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
                // Fetch publications, datasets, and projects concurrently
        const [pubRes, dsRes, projRes] = await Promise.all([
          fetch(`${API_BASE_URL}/publications/`),
          fetch(`${API_BASE_URL}/datasets/`),
          fetch(`${API_BASE_URL}/projects/`)
        ]);

        if (!pubRes.ok) throw new Error('Failed to fetch publications');

        const publicationsData = await pubRes.json();

        const datasetsData = await dsRes.ok ? await dsRes.json() : [];
        if (!dsRes.ok) throw new Error('Failed to fetch datasets');
        console.log(datasetsData);
        const projectsData = await projRes.ok ? await projRes.json() : [];

        setAllPublications(publicationsData);
        setAvailableDatasets(datasetsData);
        setAvailableProjects(projectsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // The Filtering Engine: Runs automatically when data or filters change
  const filteredPublications = useMemo(() => {
    return allPublications.filter((pub) => {
      // 1. Text Search Filter
      const matchesSearch = searchQuery === '' ||
        pub.paper_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.paper_doi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pub.authors && pub.authors.some(a =>
          (a.family && a.family.toLowerCase().includes(searchQuery.toLowerCase()))
        ));

      // 2. Dataset Filter (Must contain at least one of the selected datasets)
      const matchesDatasets = selectedDatasets.length === 0 ||
        (pub.datasets && pub.datasets.some(ds => selectedDatasets.includes(ds.id)));

      // 3. Project Filter (Must contain at least one of the selected projects)
      const matchesProjects = selectedProjects.length === 0 ||
        (pub.projects && pub.projects.some(proj => selectedProjects.includes(proj.id)));

      return matchesSearch && matchesDatasets && matchesProjects;
    });
  }, [allPublications, searchQuery, selectedDatasets, selectedProjects]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading CRUK publications...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      {/* Left Sidebar: Filters */}
      <PublicationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDatasets={selectedDatasets}
        setSelectedDatasets={setSelectedDatasets}
        selectedProjects={selectedProjects}
        setSelectedProjects={setSelectedProjects}
        availableDatasets={availableDatasets}
        availableProjects={availableProjects}
      />

      {/* Main Content Area: List */}
      <div className="flex-1 p-6 bg-gray-50 flex flex-col overflow-hidden">
        <div className="mb-4 flex justify-between items-end">
          <h1 className="text-2xl font-bold text-gray-900">Publications Directory</h1>
          <span className="text-sm text-gray-500 font-medium">
            Showing {filteredPublications.length} results
          </span>
        </div>

        <PublicationList publications={filteredPublications} />
      </div>
    </div>
  );
}
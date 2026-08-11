import React, { useState } from 'react';

const PublicationSearch = () => {
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDois, setSelectedDois] = useState(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    setResults([]);
    setHasSearched(false);

    try {
      const url = `https://api.crossref.org/works?query=${encodeURIComponent(title)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch data from Crossref API');
      }

      const data = await response.json();
      const items = data.message.items;

      const filteredItems = items
        .filter(item => {
          if (!keyword.trim()) return true;
          // Convert the entire item object to a string to search all fields
          const itemJsonString = JSON.stringify(item).toLowerCase();
          return itemJsonString.includes(keyword.toLowerCase());
        })
        .map(item => ({
          doi: item.DOI,
          title: item.title && item.title.length > 0 ? item.title[0] : 'No Title Provided',
          abstract: item.abstract || 'No abstract provided for this publication.'
        }));

      setResults(filteredItems);
      setHasSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelection = (doi) => {
    setSelectedDois(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(doi)) {
        newSelection.delete(doi);
      } else {
        newSelection.add(doi);
      }
      return newSelection;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Publication Search</h2>

      <form onSubmit={handleSearch} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dataset Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keyword (Optional)</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSearching ? 'Searching...' : 'Search Publications'}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {results.length > 0 && <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Results</h3>}

        {results.map((pub) => (
          <div key={pub.doi} className="flex items-start p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 pt-1 mr-4">
              <input
                type="checkbox"
                checked={selectedDois.has(pub.doi)}
                onChange={() => toggleSelection(pub.doi)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-600 mb-1">
                DOI: {pub.doi}
              </p>
              <p className="text-base font-bold text-gray-900 mb-2">
                {pub.title}
              </p>
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: pub.abstract }}
              />
            </div>
          </div>
        ))}

        {results.length === 0 && !isSearching && !error && hasSearched && (
          <p className="text-gray-500 italic">No publications found. Try adjusting your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default PublicationSearch;
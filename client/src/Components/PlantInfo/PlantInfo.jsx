import React, { useState } from 'react';
import Header from '../Shared/Header';
import { searchPlants } from '../../services/plantService';
import './PlantInfo.css';

const PlantInfo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Please enter a plant name');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    setSearchResults([]);

    try {
      const result = await searchPlants(searchQuery);
      const plants = result.data || [];
      setSearchResults(Array.isArray(plants) ? plants : [plants]);
    } catch (err) {
      console.error('Error searching plant:', err);
      setError('Failed to search for plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plant-info-page">
      <Header />

      <div className="plant-info-container">
        {/* Search */}
        <div className="search-section">
          <h1>Plant Information</h1>
          <p>Search for plant details, care tips, and more</p>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="plant-input"
              placeholder="Search plant name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="plant-info-results">
          {loading && (
            <div className="plant-info-message loading">
              <p>Searching for plant...</p>
            </div>
          )}

          {error && (
            <div className="plant-info-message error">
              <p>{error}</p>
            </div>
          )}

          {searched && !loading && searchResults.length === 0 && !error && (
            <div className="plant-info-message no-results">
              <p>No plant found. Try a different search.</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="plant-results-grid">
              {searchResults.map((plant, index) => (
                <div className="plant-card" key={plant._id || plant.id || index}>
                  <div className="plant-card-img-wrapper">
                    {plant.imageUrl ? (
                      <img
                        src={plant.imageUrl}
                        alt={plant.commonName || plant.scientificName}
                        className="plant-card-img"
                      />
                    ) : (
                      <div className="plant-card-no-img">
                        <span>🌱</span>
                      </div>
                    )}
                    {plant.plantType && (
                      <span className="plant-card-badge">{plant.plantType}</span>
                    )}
                  </div>
                  <div className="plant-card-body">
                    {plant.commonName && (
                      <h3 className="plant-card-name">{plant.commonName}</h3>
                    )}
                    {plant.scientificName && (
                      <p className="plant-card-scientific">{plant.scientificName}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!searched && searchResults.length === 0 && (
            <div className="plant-info-message empty">
              <p>Search for a plant to see its information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantInfo;

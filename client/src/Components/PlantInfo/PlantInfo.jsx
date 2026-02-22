import React, { useState } from 'react';
import Header from '../Shared/Header';
import './PlantInfo.css';

const PlantInfo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [plantData, setPlantData] = useState(null);
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
    setPlantData(null);

    try {
      // API call will be made here by the user
      // const response = await axios.get(
      //   `${process.env.REACT_APP_API_URL}/api/plants/search`,
      //   {
      //     params: { name: searchQuery },
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem('token')}`,
      //     },
      //   }
      // );
      // setPlantData(response.data.plant);

      // For now, leave loading state and let user integrate API
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

          {searched && !loading && !plantData && !error && (
            <div className="plant-info-message no-results">
              <p>No plant found. Try a different search.</p>
            </div>
          )}

          {plantData && (
            <div className="plant-info-card">
              <div className="plant-info-image-section">
                {plantData.image && (
                  <img 
                    src={plantData.image} 
                    alt={plantData.name}
                    className="plant-info-image"
                  />
                )}
              </div>

              <div className="plant-info-details-section">
                <div className="plant-info-header-content">
                  <h2 className="plant-info-name">{plantData.name}</h2>
                  {plantData.scientificName && (
                    <p className="plant-info-scientific">{plantData.scientificName}</p>
                  )}
                </div>

                {plantData.description && (
                  <div className="plant-info-section">
                    <h3>Description</h3>
                    <p>{plantData.description}</p>
                  </div>
                )}

                {plantData.careInstructions && (
                  <div className="plant-info-section">
                    <h3>Care Instructions</h3>
                    <p>{plantData.careInstructions}</p>
                  </div>
                )}

                {plantData.wateringNeeds && (
                  <div className="plant-info-section">
                    <h3>Watering Needs</h3>
                    <p>{plantData.wateringNeeds}</p>
                  </div>
                )}

                {plantData.sunlightRequirements && (
                  <div className="plant-info-section">
                    <h3>Sunlight Requirements</h3>
                    <p>{plantData.sunlightRequirements}</p>
                  </div>
                )}

                {plantData.soilType && (
                  <div className="plant-info-section">
                    <h3>Soil Type</h3>
                    <p>{plantData.soilType}</p>
                  </div>
                )}

                {plantData.temperature && (
                  <div className="plant-info-section">
                    <h3>Temperature</h3>
                    <p>{plantData.temperature}</p>
                  </div>
                )}

                {plantData.hardiness && (
                  <div className="plant-info-section">
                    <h3>Hardiness</h3>
                    <p>{plantData.hardiness}</p>
                  </div>
                )}

                {plantData.commonPests && (
                  <div className="plant-info-section">
                    <h3>Common Pests</h3>
                    <p>{plantData.commonPests}</p>
                  </div>
                )}

                {plantData.benefits && (
                  <div className="plant-info-section">
                    <h3>Benefits</h3>
                    <p>{plantData.benefits}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!searched && !plantData && (
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

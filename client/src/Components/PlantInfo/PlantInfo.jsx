import React, { useState } from 'react';
import Header from '../Shared/Header';
import './PlantInfo.css';

const MOCK_PLANTS = [
  {
    scientificName: 'Rosa chinensis',
    commonName: 'China Rose',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Rosa_chinensis_-_Brera_Botanical_Garden_-_DSC09820.JPG/800px-Rosa_chinensis_-_Brera_Botanical_Garden_-_DSC09820.JPG',
    plantType: 'Bush/Shrub',
  },
  {
    scientificName: 'Monstera deliciosa',
    commonName: 'Swiss Cheese Plant',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Monstera_deliciosa2.jpg/800px-Monstera_deliciosa2.jpg',
    plantType: 'Climber',
  },
  {
    scientificName: 'Aloe vera',
    commonName: 'Aloe Vera',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aloe_vera_flower_inridge.jpg/800px-Aloe_vera_flower_inridge.jpg',
    plantType: 'Succulent',
  },
  {
    scientificName: 'Ficus lyrata',
    commonName: 'Fiddle Leaf Fig',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Ficus_lyrata_-_Palmengarten.jpg/800px-Ficus_lyrata_-_Palmengarten.jpg',
    plantType: 'Tree',
  },
  {
    scientificName: 'Lavandula angustifolia',
    commonName: 'English Lavender',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Single_lavender_flower02.jpg/800px-Single_lavender_flower02.jpg',
    plantType: 'Herb/Shrub',
  },
  {
    scientificName: 'Epipremnum aureum',
    commonName: 'Golden Pothos',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Epipremnum_aureum_31082012.jpg/800px-Epipremnum_aureum_31082012.jpg',
    plantType: 'Vine',
  },
];

const PlantInfo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(MOCK_PLANTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(true);

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

    // TODO: Replace mock filter with real API call
    // try {
    //   const token = localStorage.getItem('token');
    //   const response = await axios.get(
    //     `${process.env.REACT_APP_API_URL}/api/plants/search`,
    //     {
    //       params: { name: searchQuery },
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );
    //   const plants = response.data.plants || response.data || [];
    //   setSearchResults(Array.isArray(plants) ? plants : [plants]);
    // } catch (err) {
    //   console.error('Error searching plant:', err);
    //   setError('Failed to search for plant. Please try again.');
    // }

    // Mock: filter the dummy data by query
    const query = searchQuery.toLowerCase();
    const filtered = MOCK_PLANTS.filter(
      (p) =>
        p.commonName.toLowerCase().includes(query) ||
        p.scientificName.toLowerCase().includes(query) ||
        p.plantType.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
    setLoading(false);
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
            <div className="plant-results-list">
              {searchResults.map((plant, index) => (
                <div className="plant-result-row" key={plant._id || index}>
                  <div className="plant-result-img-wrapper">
                    {plant.imageUrl ? (
                      <img
                        src={plant.imageUrl}
                        alt={plant.commonName || plant.scientificName}
                        className="plant-result-img"
                      />
                    ) : (
                      <div className="plant-result-no-img">
                        <span>🌱</span>
                      </div>
                    )}
                  </div>

                  <div className="plant-result-info">
                    {plant.commonName && (
                      <h3 className="plant-result-common">{plant.commonName}</h3>
                    )}
                    {plant.scientificName && (
                      <p className="plant-result-scientific">
                        {plant.scientificName}
                      </p>
                    )}
                    {plant.plantType && (
                      <span className="plant-result-type">{plant.plantType}</span>
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

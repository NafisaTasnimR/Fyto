import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginSignup from '../LoginSignup/LoginSignup';
import { searchPlants } from '../../services/plantService';
import './PreviewPlantInfo.css';

const PreviewPlantInfo = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('signup');

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
      setError('Failed to search for plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preview-plant-info-page">
      {showModal && (
        <LoginSignup mode={modalMode} onClose={() => setShowModal(false)} />
      )}

      <header className="fixed-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="/2.png" alt="Fyto logo" className="site-logo" />
            <span>Fyto</span>
          </div>

          <nav className="center-nav-landing">
            <button
              className="nav-link-landing"
              onClick={() => navigate('/preview-social')}
            >
              Social
            </button>
            <button
              className="nav-link-landing"
              onClick={() => navigate('/preview-marketplace')}
            >
              Marketplace
            </button>
            <button className="nav-link-landing active">
              Plant Info
            </button>
          </nav>

          <nav className="nav-buttons">
            <button className="nav-btn1" onClick={() => { setModalMode('login'); setShowModal(true); }}>Login</button>
            <button className="nav-btn1 signup-btn1" onClick={() => { setModalMode('signup'); setShowModal(true); }}>Sign In</button>
          </nav>
        </div>
      </header>

      <div className="preview-plant-info-container">

        <div className="search-section">
          <h1>Plant Information</h1>
          <p>Search for plant details, care tips, and more</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="plant-input"
              placeholder="Search plant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {searched && !loading && searchResults.length === 0 && !error && (
            <div className="plant-info-message no-results">
              <p>No plant found. Try a different search.</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <>
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
                        <div className="plant-card-no-img"><span>🌱</span></div>
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

              <div className="preview-plant-cta">
                <h3>Want full plant details?</h3>
                <p>Sign in to access care guides, watering schedules, and track your plants!</p>
                <button
                  className="preview-plant-cta-btn"
                  onClick={() => { setModalMode('signup'); setShowModal(true); }}
                >
                  Sign In to Explore
                </button>
              </div>
            </>
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

export default PreviewPlantInfo;
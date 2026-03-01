import React, { useState } from 'react';
import Header from '../Shared/Header';
import { identifyPlant } from '../../services/plantService';
import './PlantCare.css';

const PlantCare = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [plantData, setPlantData] = useState(null);
  const [plantInfo, setPlantInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlantCareInfo = async (imageFile) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await identifyPlant(imageFile);
      setPlantInfo(response.plant || null);

      if (typeof response.care === 'string') {
        setError(response.care);
      } else {
        setPlantData(response.care);
      }
    } catch (err) {
      console.error('Error identifying plant:', err);
      setError(err.response?.data?.message || 'Failed to identify plant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setError(null);
        setPlantData(null);
        setPlantInfo(null);
        fetchPlantCareInfo(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="plant-care-page">
      <Header />
      <div className="plant-care-container">
      <h1 className="page-title">Plant Care Guide</h1>
      
      {!uploadedImage && (
      <div className="search-section">
        <p>Upload a plant image to get detailed care instructions</p>
        
        <div className="upload-area">
          <label htmlFor="plant-image" className="upload-label">
            <input
              id="plant-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
            <div className="upload-box">
              <img src="/imageChallenge-icon.png" alt="upload" className="upload-icon" />
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
            </div>
          </label>
        </div>
      </div>
      )}

      {uploadedImage && (
        <div className="image-display-section">
          <div className="uploaded-image-container">
            <img src={uploadedImage} alt="Uploaded plant" className="uploaded-image" />
          </div>
          {plantInfo && (
            <div className="identified-plant-info">
              <h2>{plantInfo.plantName || plantInfo.scientificName}</h2>
              {plantInfo.scientificName && plantInfo.plantName && (
                <p className="scientific-name">{plantInfo.scientificName}</p>
              )}
              {plantInfo.confidence != null && (
                <p className="confidence">Confidence: {(plantInfo.confidence * 100).toFixed(1)}%</p>
              )}
            </div>
          )}
          <label htmlFor="plant-image-change" className="change-image-btn">
            <input
              id="plant-image-change"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
            Change Image
          </label>
        </div>
      )}

      {isLoading && (
        <div className="loading-message">
          <p>Identifying plant and generating care guide...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {plantData && uploadedImage && (
        <div className="results-section">
          <h2>Care Instructions</h2>
          
          <div className="info-grid">
            <div className="info-card">
              <h3><img src="/water.png" alt="water" className="card-icon" /> Watering Schedule</h3>
              <p>{plantData.watering_schedule}</p>
            </div>
            
            <div className="info-card">
              <h3><img src="/sun.png" alt="sun" className="card-icon" /> Sunlight</h3>
              <p>{plantData.sunlight_requirement}</p>
            </div>

            <div className="info-card">
              <h3><img src="/plant.png" alt="soil" className="card-icon" /> Soil Type</h3>
              <p>{plantData.soil_type}</p>
            </div>

            <div className="info-card">
              <h3><img src="/fertilizer.png" alt="fertilizer" className="card-icon" /> Fertilizer</h3>
              <p>{plantData.fertilizer_schedule}</p>
            </div>

            <div className="info-card">
              <h3><img src="/pruning.png" alt="pruning" className="card-icon" /> Pruning</h3>
              <p>{plantData.pruning_guide}</p>
            </div>

            <div className="info-card">
              <h3><img src="/reuse.png" alt="repotting" className="card-icon" /> Repotting</h3>
              <p>{plantData.repotting_frequency}</p>
            </div>
          </div>

          <div className="timeline-section">
            <h3><img src="/timeline.png" alt="timeline" className="section-icon" /> Care Timeline</h3>
            <ul className="timeline-list">
              {plantData.care_timeline.map((step, index) => {
                // Splitting "Week 1: ..." into bold title and description
                const [timeframe, ...descParts] = step.split(':');
                const description = descParts.join(':');
                
                return (
                  <li key={index} className="timeline-item">
                    <strong>{timeframe}:</strong> {description}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default PlantCare;
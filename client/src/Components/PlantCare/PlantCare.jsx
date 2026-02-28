import React, { useState } from 'react';
import Header from '../Shared/Header';
import './PlantCare.css';

const PlantCare = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [plantData, setPlantData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulated API call - replace this with your actual fetch logic later
  const fetchPlantCareInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock response following your exact required format
    const mockResponse = {
      watering_schedule: "Water once every 1-2 weeks, allowing soil to dry out between waterings.",
      sunlight_requirement: "Bright, indirect light. Avoid direct harsh sunlight.",
      soil_type: "Well-draining potting mix with perlite and peat moss.",
      fertilizer_schedule: "Apply a balanced liquid fertilizer once a month during spring and summer.",
      pruning_guide: "Trim yellowing or dead leaves at the base of the stem to promote new growth.",
      repotting_frequency: "Repot every 1-2 years when roots start growing out of the drainage holes.",
      care_timeline: [
        "Week 1: Allow the plant to acclimate to its new spot. Do not repot immediately. Check soil moisture.",
        "Week 2: Begin regular watering schedule. Wipe leaves with a damp cloth to remove dust.",
        "Month 1: Apply first dose of diluted fertilizer if it is growing season.",
        "Month 3: Check for root binding and assess if the plant needs a slightly larger pot."
      ]
    };

    setPlantData(mockResponse);
    setIsLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setError(null);
        setPlantData(null);
        // Automatically fetch plant care info
        fetchPlantCareInfo();
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
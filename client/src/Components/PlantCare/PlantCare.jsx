import React, { useState } from 'react';
import Header from '../Shared/Header';
import './PlantCare.css';

const PlantCare = () => {
  const [plantName, setPlantName] = useState('');
  const [plantData, setPlantData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated API call - replace this with your actual fetch logic later
  const fetchPlantCareInfo = async (name) => {
    setIsLoading(true);
    
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (plantName.trim()) {
      fetchPlantCareInfo(plantName);
    }
  };

  return (
    <div className="plant-care-page">
      <Header />
      <div className="plant-care-container">
      <div className="search-section">
        <h1>Plant Care Guide</h1>
        <p>Enter a plant name to get a detailed care schedule.</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="e.g., Monstera Deliciosa, Snake Plant..."
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            className="plant-input"
          />
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Get Care Info'}
          </button>
        </form>
      </div>

      {plantData && (
        <div className="results-section">
          <h2>Care Instructions for: <span className="highlight">{plantName}</span></h2>
          
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
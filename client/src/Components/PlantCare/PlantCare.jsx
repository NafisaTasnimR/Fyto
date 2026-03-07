import React, { useState } from 'react';
import Header from '../Shared/Header';
import { identifyPlant } from '../../services/plantService';
import './PlantCare.css';

// Helper function to detect if text is formatted as points
const isPointFormat = (text) => {
  if (!text || typeof text !== 'string') return false;
  // Check for numbered points: 1., 2., 3., etc.
  const numberedRegex = /^\s*\d+\.\s+/m;
  // Check for bullet points: *, -, •
  const bulletRegex = /^\s*[-•*]\s+/m;
  return numberedRegex.test(text) || bulletRegex.test(text);
};

// Helper function to parse and render content
const ContentRenderer = ({ content }) => {
  // Convert content to string if it's not already
  let contentStr = '';
  if (!content) {
    return <p>No information available</p>;
  }
  
  if (typeof content === 'string') {
    contentStr = content;
  } else if (typeof content === 'object') {
    contentStr = JSON.stringify(content);
  } else {
    contentStr = String(content);
  }

  // Check if content is in point format
  if (isPointFormat(contentStr)) {
    // Split by numbered pattern: "1. ", "2. ", "3. " etc
    // This handles both "1. Text" and newline separated formats
    let points = [];
    
    // First try splitting by number pattern
    const numberedSplit = contentStr.split(/(?=\d+\.\s+)/);
    if (numberedSplit.length > 1) {
      points = numberedSplit.map(p => p.trim()).filter(p => p);
    } else {
      // Fall back to splitting by lines
      points = contentStr.split('\n').filter(line => line.trim());
    }
    
    return (
      <ol className="content-list numbered">
        {points.map((point, index) => {
          // Ensure point is a string before processing
          let displayText = String(point).trim();
          
          // Remove leading numbers, dashes, and asterisks since <ol> handles numbering automatically
          displayText = displayText.replace(/^\d+\.\s*/, ''); // strip "1. "
          displayText = displayText.replace(/^[-*](?!\*)\s*/, ''); // strip single "- " or "* " but NOT bold "**"
          
          // Check if line contains markdown bold markers
          if (displayText.includes('**')) {
            // Parse bold text in the line
            const parts = displayText.split(/\*\*([^*]+)\*\*/);
            return (
              <li key={index} className="content-point">
                {parts.map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </li>
            );
          }
          
          return (
            <li key={index} className="content-point">
              {displayText}
            </li>
          );
        })}
      </ol>
    );
  }

  // If not point format, render as paragraphs
  // Split by double newlines for paragraph breaks, otherwise keep as single paragraph
  const paragraphs = contentStr.split('\n\n').filter(p => p.trim());
  
  if (paragraphs.length > 1) {
    return (
      <div className="content-paragraphs">
        {paragraphs.map((para, index) => (
          <p key={index}>{para.trim()}</p>
        ))}
      </div>
    );
  }

  return <p>{contentStr}</p>;
};

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
              <ContentRenderer content={plantData.watering_schedule} />
            </div>
            
            <div className="info-card">
              <h3><img src="/sun.png" alt="sun" className="card-icon" /> Sunlight</h3>
              <ContentRenderer content={plantData.sunlight_requirement} />
            </div>

            <div className="info-card">
              <h3><img src="/plant.png" alt="soil" className="card-icon" /> Soil Type</h3>
              <ContentRenderer content={plantData.soil_type} />
            </div>

            <div className="info-card">
              <h3><img src="/fertilizer.png" alt="fertilizer" className="card-icon" /> Fertilizer</h3>
              <ContentRenderer content={plantData.fertilizer_schedule} />
            </div>

            <div className="info-card">
              <h3><img src="/pruning.png" alt="pruning" className="card-icon" /> Pruning</h3>
              <ContentRenderer content={plantData.pruning_guide} />
            </div>

            <div className="info-card">
              <h3><img src="/reuse.png" alt="repotting" className="card-icon" /> Repotting</h3>
              <ContentRenderer content={plantData.repotting_frequency} />
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
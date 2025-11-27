import React, { useState } from 'react';
import './ProductDetail.css';

const ProductDetail = () => {
  const [selectedOption, setSelectedOption] = useState('');

  // Sample product data - replace with actual data from props or API
  const product = {
    id: 1,
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop',
    title: 'Japanese Maple Tree',
    condition: 'Healthy',
    owner: 'Sarah Johnson',
    location: 'Garden District',
    description: 'Beautiful Japanese Maple tree, approximately 5 years old. Perfect for adding color to your garden with its stunning red foliage. Well-maintained and healthy, ready for transplant. Ideal for medium-sized gardens or as a focal point in landscaping.',
    size: 'Medium (4-6 feet)',
    options: ['Pickup Only', 'With Pot', 'Bare Root']
  };

  const handleConfirm = () => {
    if (selectedOption) {
      alert(`Confirmed: ${selectedOption}`);
      // Add your confirmation logic here
    } else {
      alert('Please select an option');
    }
  };

  const handleBack = () => {
    // Add navigation back logic here
    window.history.back();
  };

  return (
    <div className="product-detail-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div className="logo-container">
            <svg className="logo-icon" width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#2E7D32"/>
              <path d="M20 8C20 8 16 14 16 18C16 20.21 17.79 22 20 22C22.21 22 24 20.21 24 18C24 14 20 8 20 8Z" fill="#81C784"/>
              <path d="M20 18L23 22C23 22 21.5 24 20 24C18.5 24 17 22 17 22L20 18Z" fill="#A5D6A7"/>
              <rect x="19" y="22" width="2" height="10" rx="1" fill="#6D4C41"/>
              <circle cx="20" cy="32" r="4" fill="#4CAF50"/>
            </svg>
            <h1 className="logo">Fyto</h1>
          </div>
        </div>
        
        <div className="header-right">
          <button className="menu-icon">☰</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="product-main">
        {/* Product Image */}
        <div className="product-image-section">
          <img src={product.image} alt={product.title} className="product-detail-image" />
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <h2 className="product-detail-title">{product.title}</h2>
          
          <div className="product-meta-info">
            <div className="meta-item">
              <span className="meta-label">Owner:</span>
              <span className="meta-value">{product.owner}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Location:</span>
              <span className="meta-value">{product.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Size:</span>
              <span className="meta-value">{product.size}</span>
            </div>
          </div>

          {/* Condition */}
          <div className="condition-section">
            <h3 className="section-title">Condition</h3>
            <div className="condition-badge">{product.condition}</div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <p className="description-text">{product.description}</p>
          </div>

          {/* Selection Options */}
          <div className="options-section">
            <h3 className="section-title">Select Option</h3>
            <div className="options-list">
              {product.options.map((option, index) => (
                <label key={index} className="option-item">
                  <input
                    type="radio"
                    name="product-option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <span className="option-label">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <div className="action-section">
            <button 
              className="confirm-btn"
              onClick={handleConfirm}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
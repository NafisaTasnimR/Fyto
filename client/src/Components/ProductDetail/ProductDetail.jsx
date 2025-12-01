import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // All products data - in a real app, this would come from an API or context
  const allProducts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop',
      title: 'Japanese Maple Tree',
      condition: 'Healthy',
      owner: 'Sarah Johnson',
      location: 'Garden District, Portland',
      description: 'Beautiful Japanese Maple tree, approximately 5 years old. Perfect for adding color to your garden with its stunning red foliage. Well-maintained and healthy, ready for transplant. Ideal for medium-sized gardens or as a focal point in landscaping. This tree has been carefully nurtured and shows vibrant seasonal color changes.',
      size: 'Medium (4-6 feet)',
      options: ['Pickup Only', 'With Pot', 'Bare Root']
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop',
      title: 'Cherry Blossom Sapling',
      condition: 'Excellent',
      owner: 'Michael Chen',
      location: 'Spring Valley, Seattle',
      description: 'Young cherry blossom tree, 2 years old. Known for its spectacular spring blooms with delicate pink flowers. This variety is particularly hardy and suitable for temperate climates. Perfect for creating a stunning focal point in your garden.',
      size: 'Small (2-3 feet)',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop',
      title: 'Pine Tree Collection',
      condition: 'Healthy',
      owner: 'Garden Masters',
      location: 'Mountain View, Colorado',
      description: 'Collection of three pine trees, ideal for creating natural privacy screens or windbreaks. These evergreens are low-maintenance and provide year-round greenery. Perfect for larger properties or rural settings.',
      size: 'Large (8-12 feet)',
      options: ['Pickup Only', 'Bare Root', 'Professional Transplant Service']
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=600&fit=crop',
      title: 'Oak Tree - Mature',
      condition: 'Excellent',
      owner: 'David Martinez',
      location: 'Oak Ridge, Tennessee',
      description: 'Mature oak tree, approximately 15 years old. This majestic tree provides excellent shade and has a strong, well-established root system. Ideal for large properties. Features beautiful fall foliage and attracts beneficial wildlife.',
      size: 'Very Large (15-20 feet)',
      options: ['Professional Transplant Required', 'Consultation Included']
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      title: 'Birch Tree Duo',
      condition: 'Healthy',
      owner: 'Emma Wilson',
      location: 'Birchwood, Minnesota',
      description: 'Pair of white birch trees, 4 years old. Known for their distinctive white bark and graceful appearance. These trees create a striking visual impact and are perfect for adding elegance to any landscape.',
      size: 'Medium (5-7 feet)',
      options: ['Pickup Only', 'With Pot', 'Bare Root']
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=600&fit=crop',
      title: 'Willow Tree - Young',
      condition: 'Healthy',
      owner: 'Robert Green',
      location: 'Riverside, California',
      description: 'Young weeping willow tree, 3 years old. Fast-growing and perfect for water features or pond-side planting. Creates a romantic, flowing appearance with its cascading branches. Thrives in moist soil conditions.',
      size: 'Medium (4-5 feet)',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
      title: 'Magnolia Tree',
      condition: 'Excellent',
      owner: 'Lisa Park',
      location: 'Magnolia Springs, Alabama',
      description: 'Stunning magnolia tree, 6 years old. Features large, fragrant white flowers in spring and glossy evergreen foliage. This Southern classic adds elegance and charm to any property. Well-suited for warm climates.',
      size: 'Large (7-9 feet)',
      options: ['Pickup Only', 'With Pot', 'Professional Transplant Service']
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&h=600&fit=crop',
      title: 'Palm Tree - Tropical',
      condition: 'Excellent',
      owner: 'James Rodriguez',
      location: 'Palm Beach, Florida',
      description: 'Beautiful tropical palm tree, 4 years old. Perfect for creating a resort-like atmosphere in your backyard. This variety is cold-hardy down to 25°F and adds instant tropical appeal. Low maintenance and drought-tolerant once established.',
      size: 'Medium (6-8 feet)',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop',
      title: 'Evergreen Collection',
      condition: 'Healthy',
      owner: 'Rachel Brown',
      location: 'Evergreen, Washington',
      description: 'Collection of mixed evergreen trees including spruce and fir. Perfect for creating natural borders or privacy screens. These trees maintain their foliage year-round and are excellent for colder climates.',
      size: 'Medium to Large (5-10 feet)',
      options: ['Pickup Only', 'Bare Root', 'Delivery Available']
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop',
      title: 'Red Maple Tree',
      condition: 'Excellent',
      owner: 'Alex Turner',
      location: 'Maple Grove, Vermont',
      description: 'Vibrant red maple tree, 5 years old. Famous for its brilliant red fall foliage. Fast-growing and adaptable to various soil conditions. Creates stunning autumn displays and provides excellent shade in summer.',
      size: 'Medium (5-7 feet)',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop',
      title: 'Flowering Plum Tree',
      condition: 'Healthy',
      owner: 'Maria Santos',
      location: 'Plum Valley, Oregon',
      description: 'Beautiful flowering plum tree, 3 years old. Features stunning pink-purple blooms in early spring followed by dark foliage. Compact size makes it perfect for smaller gardens and ornamental landscaping.',
      size: 'Small to Medium (3-5 feet)',
      options: ['Pickup Only', 'With Pot', 'Bare Root']
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=600&fit=crop',
      title: 'Ancient Oak',
      condition: 'Good',
      owner: 'Tom Anderson',
      location: 'Oak Harbor, Ohio',
      description: 'Heritage oak tree, approximately 25 years old. This magnificent specimen is a piece of living history. Requires careful professional transplanting but offers unmatched character and shade. Perfect for estate properties.',
      size: 'Extra Large (20+ feet)',
      options: ['Professional Transplant Required', 'Consultation Included', 'Permit Assistance']
    },
    {
      id: 13,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      title: 'White Birch Tree',
      condition: 'Excellent',
      owner: 'Lisa Chen',
      location: 'White Plains, New York',
      description: 'Single white birch tree, 5 years old. Features distinctive white peeling bark and golden yellow fall foliage. This tree is perfect as a specimen plant and attracts various bird species. Thrives in cooler climates.',
      size: 'Medium (5-6 feet)',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 14,
      image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=600&fit=crop',
      title: 'Weeping Willow',
      condition: 'Healthy',
      owner: 'Mark Wilson',
      location: 'Willow Creek, Montana',
      description: 'Mature weeping willow tree, 8 years old. Creates a dramatic statement with its graceful, flowing branches. Ideal for waterside locations or large properties. Fast-growing and provides excellent shade and privacy.',
      size: 'Large (10-12 feet)',
      options: ['Professional Transplant Service', 'With Root Ball', 'Consultation Included']
    },
    {
      id: 15,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
      title: 'Pink Magnolia',
      condition: 'Excellent',
      owner: 'Jessica Park',
      location: 'Magnolia, Texas',
      description: 'Spectacular pink magnolia tree, 4 years old. Features large, fragrant pink blooms in early spring. This variety is particularly striking and adds a touch of elegance to any garden. Prefers partial shade to full sun.',
      size: 'Medium (5-6 feet)',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 16,
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&h=600&fit=crop',
      title: 'Coconut Palm Tree',
      condition: 'Healthy',
      owner: 'Chris Martin',
      location: 'Coconut Grove, Florida',
      description: 'Authentic coconut palm tree, 3 years old. Brings true tropical paradise to your property. This variety produces coconuts and creates an instant vacation atmosphere. Requires warm climate and full sun exposure.',
      size: 'Medium (5-7 feet)',
      options: ['Pickup Only', 'With Pot', 'Professional Transplant Service']
    }
  ];

  // Find the current product based on ID
  const product = allProducts.find(p => p.id === parseInt(id)) || allProducts[0];

  const handleConfirm = () => {
    if (selectedOption) {
      alert(`Confirmed: ${selectedOption} for ${product.title}`);
      // Add your confirmation logic here
    } else {
      alert('Please select an option');
    }
  };

  const handleBack = () => {
    navigate('/');
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
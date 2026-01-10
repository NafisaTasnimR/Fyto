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
      treeType: 'Maple',
      treePart: 'Mature Tree',
      condition: 'Healthy',
      owner: 'Sarah Johnson',
      location: 'Dhanmondi, Dhaka',
      description: 'Beautiful Japanese Maple tree, approximately 5 years old. Perfect for adding color to your garden with its stunning red foliage. Well-maintained and healthy, ready for transplant. Ideal for medium-sized gardens or as a focal point in landscaping. This tree has been carefully nurtured and shows vibrant seasonal color changes.',
      size: 'Medium (4-6 feet)',
      postType: 'sell',
      price: '450',
      contactType: 'phone',
      contact: '+880 1712-345678',
      options: ['Pickup Only', 'With Pot', 'Bare Root']
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop',
      title: 'Cherry Blossom Sapling',
      treeType: 'Cherry Blossom',
      treePart: 'Sapling',
      condition: 'Excellent',
      owner: 'Michael Chen',
      location: 'Gulshan, Dhaka',
      description: 'Young cherry blossom tree, 2 years old. Known for its spectacular spring blooms with delicate pink flowers. This variety is particularly hardy and suitable for temperate climates. Perfect for creating a stunning focal point in your garden.',
      size: 'Small (2-3 feet)',
      postType: 'sell',
      price: '120',
      contactType: 'email',
      contact: 'michael.chen@email.com',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop',
      title: 'Pine Tree Collection',
      treeType: 'Pine',
      treePart: 'Young Tree',
      condition: 'Healthy',
      owner: 'Garden Masters',
      location: 'Uttara, Dhaka',
      description: 'Collection of three pine trees, ideal for creating natural privacy screens or windbreaks. These evergreens are low-maintenance and provide year-round greenery. Perfect for larger properties or rural settings.',
      size: 'Large (8-12 feet)',
      postType: 'exchange',
      price: '0',
      exchangeFor: 'Fruit tree saplings or oak seedlings',
      contactType: 'phone',
      contact: '+880 1923-456789',
      options: ['Pickup Only', 'Bare Root', 'Professional Transplant Service']
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=600&fit=crop',
      title: 'Oak Tree - Mature',
      treeType: 'Oak',
      treePart: 'Mature Tree',
      condition: 'Excellent',
      owner: 'David Martinez',
      location: 'Banani, Dhaka',
      description: 'Mature oak tree, approximately 15 years old. This majestic tree provides excellent shade and has a strong, well-established root system. Ideal for large properties. Features beautiful fall foliage and attracts beneficial wildlife.',
      size: 'Very Large (15-20 feet)',
      postType: 'sell',
      price: '1200',
      contactType: 'email',
      contact: 'david.martinez@email.com',
      options: ['Professional Transplant Required', 'Consultation Included']
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      title: 'Birch Tree Duo',
      treeType: 'Birch',
      treePart: 'Young Tree',
      condition: 'Healthy',
      owner: 'Emma Wilson',
      location: 'Mohammadpur, Dhaka',
      description: 'Pair of white birch trees, 4 years old. Known for their distinctive white bark and graceful appearance. These trees create a striking visual impact and are perfect for adding elegance to any landscape.',
      size: 'Medium (5-7 feet)',
      postType: 'sell',
      price: '300',
      contactType: 'phone',
      contact: '+880 1534-678901',
      options: ['Pickup Only', 'With Pot', 'Bare Root']
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=600&fit=crop',
      title: 'Willow Tree - Young',
      treeType: 'Willow',
      treePart: 'Young Tree',
      condition: 'Healthy',
      owner: 'Robert Green',
      location: 'Mirpur, Dhaka',
      description: 'Young weeping willow tree, 3 years old. Fast-growing and perfect for water features or pond-side planting. Creates a romantic, flowing appearance with its cascading branches. Thrives in moist soil conditions.',
      size: 'Medium (4-5 feet)',
      postType: 'donate',
      price: '0',
      contactType: 'email',
      contact: 'robert.green@email.com',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
      title: 'Magnolia Tree',
      treeType: 'Magnolia',
      treePart: 'Mature Tree',
      condition: 'Excellent',
      owner: 'Lisa Park',
      location: 'Bashundhara, Dhaka',
      description: 'Stunning magnolia tree, 6 years old. Features large, fragrant white flowers in spring and glossy evergreen foliage. This Southern classic adds elegance and charm to any property. Well-suited for warm climates.',
      size: 'Large (7-9 feet)',
      postType: 'sell',
      price: '680',
      contactType: 'phone',
      contact: '+880 1645-789012',
      options: ['Pickup Only', 'With Pot', 'Professional Transplant Service']
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&h=600&fit=crop',
      title: 'Palm Tree - Tropical',
      treeType: 'Palm',
      treePart: 'Potted Tree',
      condition: 'Excellent',
      owner: 'James Rodriguez',
      location: 'Motijheel, Dhaka',
      description: 'Beautiful tropical palm tree, 4 years old. Perfect for creating a resort-like atmosphere in your backyard. This variety is cold-hardy down to 25°F and adds instant tropical appeal. Low maintenance and drought-tolerant once established.',
      size: 'Medium (6-8 feet)',
      postType: 'sell',
      price: '550',
      contactType: 'email',
      contact: 'j.rodriguez@email.com',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop',
      title: 'Evergreen Collection',
      treeType: 'Evergreen',
      treePart: 'Seedling',
      condition: 'Healthy',
      owner: 'Rachel Brown',
      location: 'Khilgaon, Dhaka',
      description: 'Collection of mixed evergreen seedlings including spruce and fir. Perfect for creating natural borders or privacy screens. These trees maintain their foliage year-round and are excellent for colder climates.',
      size: 'Small (1-2 feet)',
      postType: 'exchange',
      price: '0',
      exchangeFor: 'Flowering tree seeds or gardening equipment',
      contactType: 'phone',
      contact: '+880 1756-890123',
      options: ['Pickup Only', 'Bare Root', 'Delivery Available']
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop',
      title: 'Red Maple Tree',
      treeType: 'Maple',
      treePart: 'Young Tree',
      condition: 'Excellent',
      owner: 'Alex Turner',
      location: 'Rampura, Dhaka',
      description: 'Vibrant red maple tree, 5 years old. Famous for its brilliant red fall foliage. Fast-growing and adaptable to various soil conditions. Creates stunning autumn displays and provides excellent shade in summer.',
      size: 'Medium (5-7 feet)',
      postType: 'sell',
      price: '400',
      contactType: 'email',
      contact: 'alex.turner@email.com',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop',
      title: 'Flowering Plum Tree',
      treeType: 'Fruit Tree',
      treePart: 'Sapling',
      condition: 'Healthy',
      owner: 'Maria Santos',
      location: 'Badda, Dhaka',
      description: 'Beautiful flowering plum tree, 3 years old. Features stunning pink-purple blooms in early spring followed by dark foliage. Compact size makes it perfect for smaller gardens and ornamental landscaping.',
      size: 'Small to Medium (3-5 feet)',
      postType: 'sell',
      price: '180',
      contactType: 'phone',
      contact: '+880 1867-901234',
      options: ['Pickup Only', 'With Pot', 'Bare Root']
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=600&fit=crop',
      title: 'Ancient Oak',
      treeType: 'Oak',
      treePart: 'Whole Tree with Root Ball',
      condition: 'Good',
      owner: 'Tom Anderson',
      location: 'Baridhara, Dhaka',
      description: 'Heritage oak tree, approximately 25 years old. This magnificent specimen is a piece of living history. Requires careful professional transplanting but offers unmatched character and shade. Perfect for estate properties.',
      size: 'Extra Large (20+ feet)',
      postType: 'sell',
      price: '2500',
      contactType: 'email',
      contact: 'tom.anderson@email.com',
      options: ['Professional Transplant Required', 'Consultation Included', 'Permit Assistance']
    },
    {
      id: 13,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      title: 'White Birch Tree',
      treeType: 'Birch',
      treePart: 'Bare Root Tree',
      condition: 'Excellent',
      owner: 'Lisa Chen',
      location: 'Tejgaon, Dhaka',
      description: 'Single white birch tree, 5 years old. Features distinctive white peeling bark and golden yellow fall foliage. This tree is perfect as a specimen plant and attracts various bird species. Thrives in cooler climates.',
      size: 'Medium (5-6 feet)',
      postType: 'sell',
      price: '280',
      contactType: 'phone',
      contact: '+880 1978-012345',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 14,
      image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=600&fit=crop',
      title: 'Weeping Willow',
      treeType: 'Willow',
      treePart: 'Mature Tree',
      condition: 'Healthy',
      owner: 'Mark Wilson',
      location: 'Lalmatia, Dhaka',
      description: 'Mature weeping willow tree, 8 years old. Creates a dramatic statement with its graceful, flowing branches. Ideal for waterside locations or large properties. Fast-growing and provides excellent shade and privacy.',
      size: 'Large (10-12 feet)',
      postType: 'sell',
      price: '850',
      contactType: 'email',
      contact: 'mark.wilson@email.com',
      options: ['Professional Transplant Service', 'With Root Ball', 'Consultation Included']
    },
    {
      id: 15,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=600&fit=crop',
      title: 'Pink Magnolia',
      treeType: 'Magnolia',
      treePart: 'Young Tree',
      condition: 'Excellent',
      owner: 'Jessica Park',
      location: 'Shyamoli, Dhaka',
      description: 'Spectacular pink magnolia tree, 4 years old. Features large, fragrant pink blooms in early spring. This variety is particularly striking and adds a touch of elegance to any garden. Prefers partial shade to full sun.',
      size: 'Medium (5-6 feet)',
      postType: 'donate',
      price: '0',
      contactType: 'phone',
      contact: '+880 1389-123456',
      options: ['Pickup Only', 'With Pot', 'Delivery Available']
    },
    {
      id: 16,
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&h=600&fit=crop',
      title: 'Coconut Palm Tree',
      treeType: 'Palm',
      treePart: 'Potted Tree',
      condition: 'Healthy',
      owner: 'Chris Martin',
      location: 'Panthapath, Dhaka',
      description: 'Authentic coconut palm tree, 3 years old. Brings true tropical paradise to your property. This variety produces coconuts and creates an instant vacation atmosphere. Requires warm climate and full sun exposure.',
      size: 'Medium (5-7 feet)',
      postType: 'sell',
      price: '620',
      contactType: 'email',
      contact: 'chris.martin@email.com',
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
          
          {/* Post Type Badge */}
          <div className="post-type-badge-container">
            <span className={`post-type-badge ${product.postType}`}>
              {product.postType === 'sell' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  For Sale
                </>
              ) : product.postType === 'exchange' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 3l4 4-4 4"/>
                    <path d="M20 7H4"/>
                    <path d="M8 21l-4-4 4-4"/>
                    <path d="M4 17h16"/>
                  </svg>
                  For Exchange
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  Free - Donation
                </>
              )}
            </span>
            {product.postType === 'sell' && (
              <span className="price-display">৳{parseInt(product.price).toLocaleString()}</span>
            )}
          </div>

          {/* Tree Information Grid */}
          <div className="product-meta-info">
            <div className="meta-item">
              <span className="meta-label">Tree Type:</span>
              <span className="meta-value">{product.treeType}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Offering:</span>
              <span className="meta-value">{product.treePart}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Size:</span>
              <span className="meta-value">{product.size}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Condition:</span>
              <span className="meta-value">{product.condition}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Owner:</span>
              <span className="meta-value">{product.owner}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Location:</span>
              <span className="meta-value">{product.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Contact Type:</span>
              <span className="meta-value">{product.contactType === 'phone' ? 'Phone Number' : 'Email Address'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Contact:</span>
              <span className="meta-value contact-link">
                {product.contactType === 'phone' ? (
                  <a href={`tel:${product.contact}`}>{product.contact}</a>
                ) : (
                  <a href={`mailto:${product.contact}`}>{product.contact}</a>
                )}
              </span>
            </div>
          </div>

          {/* Exchange For (only for exchange posts) */}
          {product.postType === 'exchange' && product.exchangeFor && (
            <div className="exchange-section">
              <h3 className="section-title">Looking for in Exchange</h3>
              <div className="exchange-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 3l4 4-4 4"/>
                  <path d="M20 7H4"/>
                  <path d="M8 21l-4-4 4-4"/>
                  <path d="M4 17h16"/>
                </svg>
                <span>{product.exchangeFor}</span>
              </div>
            </div>
          )}

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
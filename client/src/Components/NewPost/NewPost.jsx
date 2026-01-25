import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewPost.css';

const NewPost = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    treeName: '',
    treeType: '',
    customTreeType: '', // for when user selects "Other"
    treePart: '', // seed, sapling, mature tree, etc.
    customTreePart: '', // for when user selects "Other"
    description: '',
    postType: 'sell', // 'sell', 'donate', or 'exchange'
    price: '',
    exchangeFor: '', // what user wants in exchange
    contactType: 'phone', // 'phone' or 'email'
    contact: '',
    image: null,
    imagePreview: null
  });

  const [errors, setErrors] = useState({});

  const treeTypes = [
    'Maple',
    'Oak',
    'Pine',
    'Birch',
    'Willow',
    'Cherry Blossom',
    'Magnolia',
    'Palm',
    'Evergreen',
    'Fruit Tree',
    'Flowering Tree',
    'Shade Tree',
    'Other'
  ];

  const treeParts = [
    'Seeds',
    'Seedling',
    'Sapling',
    'Young Tree',
    'Mature Tree',
    'Cuttings',
    'Root Division',
    'Whole Tree with Root Ball',
    'Bare Root Tree',
    'Potted Tree',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePostTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      postType: type,
      price: type === 'sell' ? prev.price : '',
      exchangeFor: type === 'exchange' ? prev.exchangeFor : ''
    }));
  };

  const handleContactTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      contactType: type,
      contact: '' // Clear contact when switching types
    }));
    // Clear contact error when switching
    if (errors.contact) {
      setErrors(prev => ({
        ...prev,
        contact: ''
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }

      // Compress and convert image to base64
      compressImage(file);
    }
  };

  const compressImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate new dimensions (max 1200px width/height)
        let width = img.width;
        let height = img.height;
        const maxSize = 1200;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression (0.7 quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: compressedBase64
        }));
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validatePhone = (phone) => {
  const digitsOnly = phone.replace(/\D/g, '');



  if (!(digitsOnly.length === 11 || digitsOnly.length === 13)) {
    return false;
  }

  // Must start with 01 or 8801
  if (
    !digitsOnly.startsWith("01") &&
    !digitsOnly.startsWith("8801")
  ) {
    return false;
  }

  return true;
};


  const validateEmail = (email) => {
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.treeName.trim()) {
      newErrors.treeName = 'Tree name is required';
    }

    if (!formData.treeType) {
      newErrors.treeType = 'Please select a tree type';
    } else if (formData.treeType === 'Other' && !formData.customTreeType.trim()) {
      newErrors.customTreeType = 'Please specify the tree type';
    }

    if (!formData.treePart) {
      newErrors.treePart = 'Please select what part of the tree you are offering';
    } else if (formData.treePart === 'Other' && !formData.customTreePart.trim()) {
      newErrors.customTreePart = 'Please specify what you are offering';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (formData.postType === 'sell' && !formData.price.trim()) {
      newErrors.price = 'Price is required for selling';
    } else if (formData.postType === 'sell' && isNaN(formData.price)) {
      newErrors.price = 'Please enter a valid price';
    }

    if (formData.postType === 'exchange' && !formData.exchangeFor.trim()) {
      newErrors.exchangeFor = 'Please specify what you want in exchange';
    }

    // Contact validation
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact information is required';
    } else {
      if (formData.contactType === 'phone') {
        if (!validatePhone(formData.contact)) {
          newErrors.contact = 'Please enter a valid phone number ';
        }
      } else if (formData.contactType === 'email') {
        if (!validateEmail(formData.contact)) {
          newErrors.contact = 'Please enter a valid email address (e.g., example@email.com)';
        }
      }
    }

    if (!formData.imagePreview) {
      newErrors.image = 'Please upload an image of the tree';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          alert('Please login to create a post');
          navigate('/login');
          return;
        }

        // Prepare marketplace post data
        const finalTreeType = formData.treeType === 'Other' ? formData.customTreeType : formData.treeType;
        const finalTreePart = formData.treePart === 'Other' ? formData.customTreePart : formData.treePart;

        const marketplaceData = {
          photos: formData.imagePreview ? [formData.imagePreview] : [],
          treeName: formData.treeName,
          treeType: finalTreeType,
          offering: finalTreePart,
          description: formData.description,
          postType: formData.postType,
          price: formData.postType === 'sell' ? parseFloat(formData.price) : 0,
          contactInfo: formData.contact,
          treeAge: 0 // You can add age field if needed
        };

        // If exchange, add what they want in description
        if (formData.postType === 'exchange') {
          marketplaceData.description += `\n\nLooking for: ${formData.exchangeFor}`;
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/marketplace`,
          marketplaceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          alert('Marketplace post created successfully!');
          navigate('/store'); 
        } else {
          alert('Failed to create post: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
      }
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="new-post-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="back-btn" onClick={handleCancel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="logo-container">
            <svg className="logo-icon" width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#2E7D32" />
              <path d="M20 8C20 8 16 14 16 18C16 20.21 17.79 22 20 22C22.21 22 24 20.21 24 18C24 14 20 8 20 8Z" fill="#81C784" />
              <path d="M20 18L23 22C23 22 21.5 24 20 24C18.5 24 17 22 17 22L20 18Z" fill="#A5D6A7" />
              <rect x="19" y="22" width="2" height="10" rx="1" fill="#6D4C41" />
              <circle cx="20" cy="32" r="4" fill="#4CAF50" />
            </svg>
            <h1 className="logo">Fyto</h1>
          </div>
        </div>

        <div className="header-right">
          <button className="menu-icon">☰</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="new-post-main">
        <div className="form-header">
          <h2 className="form-title">Create New Post</h2>
          <p className="form-subtitle">Share your tree with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          {/* Image Upload Section */}
          <div className="form-section">
            <label className="section-label">Tree Photo *</label>
            <div className="image-upload-container">
              {formData.imagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={formData.imagePreview} alt="Tree preview" className="image-preview" />
                  <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="image-upload-placeholder" onClick={handleImageClick}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p className="upload-text">Click to upload image</p>
                  <p className="upload-hint">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
            </div>
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          {/* Tree Name */}
          <div className="form-section">
            <label htmlFor="treeName" className="section-label">Tree Name *</label>
            <input
              type="text"
              id="treeName"
              name="treeName"
              value={formData.treeName}
              onChange={handleInputChange}
              placeholder="e.g., Japanese Maple Tree"
              className={`form-input ${errors.treeName ? 'error' : ''}`}
            />
            {errors.treeName && <span className="error-message">{errors.treeName}</span>}
          </div>

          {/* Tree Type */}
          <div className="form-section">
            <label htmlFor="treeType" className="section-label">Tree Type *</label>
            <select
              id="treeType"
              name="treeType"
              value={formData.treeType}
              onChange={handleInputChange}
              className={`form-select ${errors.treeType ? 'error' : ''}`}
            >
              <option value="">Select tree type</option>
              {treeTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.treeType && <span className="error-message">{errors.treeType}</span>}

            {/* Show custom input if Other is selected */}
            {formData.treeType === 'Other' && (
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  name="customTreeType"
                  value={formData.customTreeType}
                  onChange={handleInputChange}
                  placeholder="Please specify the tree type"
                  className={`form-input ${errors.customTreeType ? 'error' : ''}`}
                />
                {errors.customTreeType && <span className="error-message">{errors.customTreeType}</span>}
              </div>
            )}
          </div>

          {/* Tree Part */}
          <div className="form-section">
            <label htmlFor="treePart" className="section-label">What are you offering? *</label>
            <select
              id="treePart"
              name="treePart"
              value={formData.treePart}
              onChange={handleInputChange}
              className={`form-select ${errors.treePart ? 'error' : ''}`}
            >
              <option value="">Select what you're offering</option>
              {treeParts.map((part) => (
                <option key={part} value={part}>{part}</option>
              ))}
            </select>
            {errors.treePart && <span className="error-message">{errors.treePart}</span>}

            {/* Show custom input if Other is selected */}
            {formData.treePart === 'Other' && (
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  name="customTreePart"
                  value={formData.customTreePart}
                  onChange={handleInputChange}
                  placeholder="Please specify what you're offering"
                  className={`form-input ${errors.customTreePart ? 'error' : ''}`}
                />
                {errors.customTreePart && <span className="error-message">{errors.customTreePart}</span>}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-section">
            <label htmlFor="description" className="section-label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your tree, its age, condition, special features..."
              rows="5"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
            />
            <div className="char-count">
              {formData.description.length} characters
            </div>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Post Type - Sell, Exchange, or Donate */}
          <div className="form-section">
            <label className="section-label">Post Type *</label>
            <div className="post-type-buttons">
              <button
                type="button"
                className={`post-type-btn ${formData.postType === 'sell' ? 'active' : ''}`}
                onClick={() => handlePostTypeChange('sell')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Sell
              </button>
              <button
                type="button"
                className={`post-type-btn ${formData.postType === 'exchange' ? 'active' : ''}`}
                onClick={() => handlePostTypeChange('exchange')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 3l4 4-4 4" />
                  <path d="M20 7H4" />
                  <path d="M8 21l-4-4 4-4" />
                  <path d="M4 17h16" />
                </svg>
                Exchange
              </button>
              <button
                type="button"
                className={`post-type-btn ${formData.postType === 'donate' ? 'active' : ''}`}
                onClick={() => handlePostTypeChange('donate')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Donate
              </button>
            </div>
          </div>

          {/* Price (disabled if donate or exchange) */}
          <div className="form-section">
            <label htmlFor="price" className="section-label">
              Price {formData.postType === 'sell' ? '*' : '(Only for selling)'}
            </label>
            <div className="price-input-wrapper">
              <span className="currency-symbol">৳</span>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                disabled={formData.postType !== 'sell'}
                className={`form-input price-input ${errors.price ? 'error' : ''} ${formData.postType !== 'sell' ? 'disabled' : ''}`}
              />
            </div>
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          {/* Exchange For (only shown for exchange) */}
          {formData.postType === 'exchange' && (
            <div className="form-section">
              <label htmlFor="exchangeFor" className="section-label">What do you want in exchange? *</label>
              <input
                type="text"
                id="exchangeFor"
                name="exchangeFor"
                value={formData.exchangeFor}
                onChange={handleInputChange}
                placeholder="e.g., Oak tree seedlings, Gardening tools, etc."
                className={`form-input ${errors.exchangeFor ? 'error' : ''}`}
              />
              {errors.exchangeFor && <span className="error-message">{errors.exchangeFor}</span>}
            </div>
          )}

          {/* Contact Type Selection */}
          <div className="form-section">
            <label className="section-label">Contact Method *</label>
            <div className="contact-type-buttons">
              <button
                type="button"
                className={`contact-type-btn ${formData.contactType === 'phone' ? 'active' : ''}`}
                onClick={() => handleContactTypeChange('phone')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Phone Number
              </button>
              <button
                type="button"
                className={`contact-type-btn ${formData.contactType === 'email' ? 'active' : ''}`}
                onClick={() => handleContactTypeChange('email')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Address
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <label htmlFor="contact" className="section-label">
              {formData.contactType === 'phone' ? 'Phone Number *' : 'Email Address *'}
            </label>
            <input
              type={formData.contactType === 'email' ? 'email' : 'tel'}
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder={
                formData.contactType === 'phone' 
                  ? 'e.g., +8801234567890 or 01234567890' 
                  : 'e.g., example@email.com'
              }
              className={`form-input ${errors.contact ? 'error' : ''}`}
            />
            {errors.contact && <span className="error-message">{errors.contact}</span>}
            {!errors.contact && formData.contactType === 'phone' && (
              <span className="input-hint">Enter a valid phone number </span>
            )}
            {!errors.contact && formData.contactType === 'email' && (
              <span className="input-hint">Enter a valid email address</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Post
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewPost;
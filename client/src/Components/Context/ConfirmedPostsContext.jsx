import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const ConfirmedPostsContext = createContext();

// Custom hook to use the context
export const useConfirmedPosts = () => {
  const context = useContext(ConfirmedPostsContext);
  if (!context) {
    throw new Error('useConfirmedPosts must be used within a ConfirmedPostsProvider');
  }
  return context;
};

// Provider component
export const ConfirmedPostsProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [confirmedPosts, setConfirmedPosts] = useState(() => {
    const saved = localStorage.getItem('confirmedPosts');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever confirmedPosts changes
  useEffect(() => {
    localStorage.setItem('confirmedPosts', JSON.stringify(confirmedPosts));
  }, [confirmedPosts]);

  // Function to add a confirmed post
  const confirmPost = (postId, option) => {
    const confirmation = {
      postId,
      option,
      confirmedAt: new Date().toISOString()
    };
    
    setConfirmedPosts(prev => {
      // Check if already confirmed
      if (prev.some(p => p.postId === postId)) {
        return prev;
      }
      return [...prev, confirmation];
    });
  };

  // Function to check if a post is confirmed
  const isPostConfirmed = (postId) => {
    return confirmedPosts.some(p => p.postId === postId);
  };

  // Function to get confirmation details
  const getConfirmationDetails = (postId) => {
    return confirmedPosts.find(p => p.postId === postId);
  };

  // Function to remove a confirmation (if needed for admin purposes)
  const removeConfirmation = (postId) => {
    setConfirmedPosts(prev => prev.filter(p => p.postId !== postId));
  };

  // Function to clear all confirmations (for testing/admin)
  const clearAllConfirmations = () => {
    setConfirmedPosts([]);
    localStorage.removeItem('confirmedPosts');
  };

  const value = {
    confirmedPosts,
    confirmPost,
    isPostConfirmed,
    getConfirmationDetails,
    removeConfirmation,
    clearAllConfirmations
  };

  return (
    <ConfirmedPostsContext.Provider value={value}>
      {children}
    </ConfirmedPostsContext.Provider>
  );
};
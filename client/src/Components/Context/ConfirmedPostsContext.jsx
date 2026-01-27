import React, { createContext, useState, useContext, useEffect } from 'react';


const ConfirmedPostsContext = createContext();


export const useConfirmedPosts = () => {
  const context = useContext(ConfirmedPostsContext);
  if (!context) {
    throw new Error('useConfirmedPosts must be used within a ConfirmedPostsProvider');
  }
  return context;
};


export const ConfirmedPostsProvider = ({ children }) => {
  
  const [confirmedPosts, setConfirmedPosts] = useState(() => {
    const saved = localStorage.getItem('confirmedPosts');
    return saved ? JSON.parse(saved) : [];
  });

  
  useEffect(() => {
    localStorage.setItem('confirmedPosts', JSON.stringify(confirmedPosts));
  }, [confirmedPosts]);

  const confirmPost = (postId, option) => {
    const confirmation = {
      postId,
      option,
      confirmedAt: new Date().toISOString()
    };
    
    setConfirmedPosts(prev => {
      
      if (prev.some(p => p.postId === postId)) {
        return prev;
      }
      return [...prev, confirmation];
    });
  };

  
  const isPostConfirmed = (postId) => {
    return confirmedPosts.some(p => p.postId === postId);
  };

 
  const getConfirmationDetails = (postId) => {
    return confirmedPosts.find(p => p.postId === postId);
  };

 
  const removeConfirmation = (postId) => {
    setConfirmedPosts(prev => prev.filter(p => p.postId !== postId));
  };

  
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
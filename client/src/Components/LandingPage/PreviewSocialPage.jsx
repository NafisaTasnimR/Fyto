import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginSignup from '../LoginSignup/LoginSignup';
import './PreviewSocialPage.css';

const PreviewSocialPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('signup');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        token ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } : {}
      );

      if (response.data.success && response.data.posts) {
        const limitedPosts = response.data.posts.slice(0, 5);
        setPosts(limitedPosts);
        setError(null);
      } else {
        setError('No posts available');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching preview posts:', err);
      setError('Failed to load posts. Please try again later.');
      setLoading(false);
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return postDate.toLocaleDateString();
  };

  return (
    <div className="preview-social-page">
      {showModal && <LoginSignup mode={modalMode} onClose={() => setShowModal(false)} />}

      <header className="fixed-header preview-header">
        <div className="header-content">
          <div className="logo">
            <img src="/2.png" alt="Fyto logo" className="site-logo" />
            <span>Fyto</span>
          </div>
          
          <div className="preview-page-title-container">
            <h1>Social</h1>
          </div>
          
          <div className="preview-header-right">
            <button className="preview-login-btn" onClick={() => { setModalMode('login'); setShowModal(true); }}>
              Login
            </button>
            <button className="preview-signup-btn" onClick={() => { setModalMode('signup'); setShowModal(true); }}>
              Sign In
            </button>
          </div>
        </div>
      </header>

      <button className="back-button-preview" onClick={() => navigate('/')} title="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      </button>

      <div className="preview-social-container">
      <div className="preview-page-subtitle">
        <p>See what our plant community is sharing</p>
      </div>

      {loading ? (
        <div className="preview-loading">
          <p>Loading posts...</p>
        </div>
      ) : error ? (
        <div className="preview-error">
          <p>{error}</p>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="preview-posts-list">
            {posts.map((post) => (
              <div key={post._id} className="preview-post-card">
                <div className="preview-post-header">
                  <img
                    src={post.authorId?.profilePic || '/boy.png'}
                    alt={post.authorId?.username}
                    className="preview-post-avatar"
                  />
                  <div className="preview-post-meta">
                    <h4>{post.authorId?.username || 'Unknown User'}</h4>
                    <span className="preview-post-time">
                      {formatTimestamp(post.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="preview-post-content">
                  <p>{post.content}</p>
                  {post.images && post.images.length > 0 && (
                    <img
                      src={post.images[0]}
                      alt="post"
                      className="preview-post-image"
                    />
                  )}
                </div>

                <div className="preview-post-footer">
                  <span className="preview-post-stat">
                    {post.likes?.length || 0} likes
                  </span>
                  <span className="preview-post-stat">
                    {post.comments?.length || 0} comments
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="preview-signup-cta">
            <h3>Want to join the conversation?</h3>
            <p>Sign in to share your plant journey, like posts, and connect with other plant lovers!</p>
            <button className="preview-signup-btn-cta" onClick={() => { setModalMode('signup'); setShowModal(true); }}>
              Sign In to Join
            </button>
          </div>
        </>
      ) : (
        <div className="preview-empty">
          <p>No posts yet. Be the first to share!</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default PreviewSocialPage;

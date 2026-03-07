import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SharedPost.css';
import { getProfilePic } from '../../utils/imageUtils';
import LoginSignup from '../LoginSignup/LoginSignup';

const SharedPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('signup');

  useEffect(() => {
    fetchSharedPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchSharedPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/shared/${postId}`,
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {}
      );

      if (response.data && response.data.success) {
        setPost(response.data.post);
        setComments(response.data.comments || []);
        setError(null);
      } else {
        setError(response.data?.message || 'Failed to load post');
      }
    } catch (err) {
      console.error('Error fetching shared post:', err);
      if (err.response?.status === 404) {
        setError('Post not found');
      } else if (err.response?.status === 403) {
        setError('This post is private and cannot be shared');
      } else {
        setError(err.response?.data?.message || 'Failed to load post. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const renderComment = (comment, level = 0) => {
    return (
      <div key={comment._id} className={`comment ${level > 0 ? 'reply' : ''}`}>
        <div className="comment-header">
          <img
            src={getProfilePic(comment.authorId?.profilePic)}
            alt={comment.authorId?.username || 'User'}
            className="comment-avatar"
          />
          <div className="comment-info">
            <span className="comment-username">{comment.authorId?.username || 'Anonymous'}</span>
            <span className="comment-timestamp">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        <p className="comment-text">{comment.content}</p>
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map(reply => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const displayComments = () => {
    if (!comments || comments.length === 0) {
      return <p className="no-comments">No comments yet. Be the first to comment!</p>;
    }
    return comments.map(comment => renderComment(comment));
  };

  if (loading) {
    return (
      <div className="shared-post-container">
        <header className="fixed-header">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <img src="/2.png" alt="Fyto logo" className="site-logo" />
              <span>Fyto</span>
            </div>
            <nav className="nav-buttons">
              <button className="nav-btn1" onClick={() => { setModalMode('login'); setShowModal(true); }}>Login</button>
              <button className="nav-btn1 signup-btn1" onClick={() => { setModalMode('signup'); setShowModal(true); }}>Sign In</button>
            </nav>
          </div>
        </header>
        <div className="shared-post-loading">
          <div className="spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-post-container">
        {showModal && <LoginSignup mode={modalMode} onClose={() => setShowModal(false)} />}
        <header className="fixed-header">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <img src="/2.png" alt="Fyto logo" className="site-logo" />
              <span>Fyto</span>
            </div>
            <nav className="nav-buttons">
              <button className="nav-btn1" onClick={() => { setModalMode('login'); setShowModal(true); }}>Login</button>
              <button className="nav-btn1 signup-btn1" onClick={() => { setModalMode('signup'); setShowModal(true); }}>Sign In</button>
            </nav>
          </div>
        </header>
        <div className="shared-post-error">
          <div className="error-icon">⚠️</div>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="shared-post-container">
        {showModal && <LoginSignup mode={modalMode} onClose={() => setShowModal(false)} />}
        <header className="fixed-header">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <img src="/2.png" alt="Fyto logo" className="site-logo" />
              <span>Fyto</span>
            </div>
            <nav className="nav-buttons">
              <button className="nav-btn1" onClick={() => { setModalMode('login'); setShowModal(true); }}>Login</button>
              <button className="nav-btn1 signup-btn1" onClick={() => { setModalMode('signup'); setShowModal(true); }}>Sign In</button>
            </nav>
          </div>
        </header>
        <div className="shared-post-error">
          <p>Post not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-post-container">
      {showModal && <LoginSignup mode={modalMode} onClose={() => setShowModal(false)} />}

      <header className="fixed-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="/2.png" alt="Fyto logo" className="site-logo" />
            <span>Fyto</span>
          </div>
          <nav className="nav-buttons">
            <button className="nav-btn1" onClick={() => { setModalMode('login'); setShowModal(true); }}>Login</button>
            <button className="nav-btn1 signup-btn1" onClick={() => { setModalMode('signup'); setShowModal(true); }}>Sign In</button>
          </nav>
        </div>
      </header>

      <div className="shared-post-content">
        <div className="shared-post-card">
          <div className="post-header">
            <div className="post-author">
              <img
                src={getProfilePic(post.authorId?.profilePic)}
                alt={post.authorId?.username || 'User'}
                className="post-avatar"
              />
              <div className="post-author-info">
                <span className="post-username">{post.authorId?.username || 'Anonymous'}</span>
                <span className="post-timestamp">{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {post.content && (
            <div className="post-caption">
              <p>{post.content}</p>
            </div>
          )}

          {post.images && post.images.length > 0 && (
            <div className="post-image-container">
              <img
                src={post.images[0]}
                alt="Post"
                className="post-image"
                onClick={() => setShowImageViewer(true)}
              />
            </div>
          )}

          <div className="post-actions">
            <button
              className="action-btn like-btn"
              onClick={() => { setModalMode('signup'); setShowModal(true); }}
              title="Like this post"
            >
              <img src="/leaf.png" alt="like" className="action-icon" />
            </button>
            <button
              className="action-btn comment-btn"
              onClick={() => { setModalMode('signup'); setShowModal(true); }}
              title="Comment on this post"
            >
              <img src="/cmnt.png" alt="comment" className="action-icon" />
            </button>
          </div>

          <div className="likes-info">
            <span className="likes-count">{post.likesCount || 0} {(post.likesCount || 0) === 1 ? 'like' : 'likes'}</span>
          </div>

          {comments.length > 0 && (
            <div className="comments-section">
              <h3>Comments ({comments.length})</h3>
              <div className="comments-list">{displayComments()}</div>
            </div>
          )}

          {comments.length === 0 && (
            <div className="comments-section">
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            </div>
          )}

          <div className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">Join Fyto</h3>
              <p className="cta-text">Sign up to like, comment, and interact with posts in our plant community!</p>
              <div className="cta-buttons">
                <button className="btn-cta-primary" onClick={() => { setModalMode('signup'); setShowModal(true); }}>Sign Up</button>
                <button className="btn-cta-secondary" onClick={() => { setModalMode('login'); setShowModal(true); }}>Already have an account? Log In</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageViewer && post.images && post.images.length > 0 && (
        <div className="image-viewer-overlay" onClick={() => setShowImageViewer(false)}>
          <button className="close-viewer" onClick={() => setShowImageViewer(false)}>✕</button>
          <img
            src={post.images[0]}
            alt="Full size"
            className="image-viewer-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default SharedPost;
import React, { useState } from 'react';
import './SocialPage.css';

const SocialPage = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [newPostData, setNewPostData] = useState({
    caption: '',
    image: null,
    imagePreview: null,
  });

  // Sample posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'plant_lover_alex',
      userAvatar: '/girl.png',
      postImage: '/g1.jpg',
      likes: 245,
      caption: 'My Monstera is finally growing a new leaf! 🪴 Took 3 months but it was worth the wait. Consistent watering and bright indirect light is the key! #PlantCare #Monstera #PlantParent',
      timestamp: '2 hours ago',
      liked: false,
      comments: [
        { id: 1, username: 'garden_guru', text: 'Beautiful! How often do you water it?' },
        { id: 2, username: 'succulent_queen', text: 'That leaf is huge! Mine never grows this big' },
      ],
    },
    {
      id: 2,
      username: 'green_thumb_sam',
      userAvatar: '/g.png',
      postImage: '/g2.jpg',
      likes: 532,
      caption: 'First harvest of the season! 🍅🌿 Organic homegrown tomatoes taste so much better. Anyone else growing veggies at home? #HomeGarden #OrganicFarming #GardenLife',
      timestamp: '5 hours ago',
      liked: false,
      comments: [
        { id: 1, username: 'veggie_grower', text: 'Those look so fresh and healthy!' },
      ],
    },
    {
      id: 3,
      username: 'jungle_explorer_josh',
      userAvatar: '/m.png',
      postImage: '/g3.jpg',
      likes: 892,
      caption: 'My living room has officially become a jungle! 🌿🌱 I now have 47 plants and I\'m not done collecting 😅 #PlantCollection #IndoorPlants #PlantJungle #PlantAddict',
      timestamp: '1 day ago',
      liked: false,
      comments: [],
    },
    {
      id: 4,
      username: 'succulent_collection',
      userAvatar: '/s.png',
      postImage: '/g4.jpg',
      likes: 421,
      caption: 'Propagation success! 🌵✨ Started from a single leaf 2 months ago and now I have 12 baby plants! Low maintenance and so satisfying to watch grow. #Succulents #Propagation #PlantProp #GardeningTips',
      timestamp: '1 day ago',
      liked: false,
      comments: [
        { id: 1, username: 'plant_scientist', text: 'Looks so healthy! What species are these?' },
      ],
    },
  ]);

  const toggleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostData.caption.trim() || !newPostData.image) {
      alert('Please add a caption and select an image');
      return;
    }

    const newPost = {
      id: posts.length + 1,
      username: 'Your Name',
      userAvatar: '/boy.png',
      postImage: newPostData.imagePreview,
      likes: 0,
      caption: newPostData.caption,
      timestamp: 'now',
      liked: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostData({ caption: '', image: null, imagePreview: null });
    setShowCreatePostModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostData({
          ...newPostData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const Post = ({ post }) => {
    return (
      <div className="post">
        {/* Post Header */}
        <div className="post-header">
          <img src={post.userAvatar} alt={post.username} className="avatar" />
          <div className="header-info">
            <h3 className="username">{post.username}</h3>
            <span className="timestamp">{post.timestamp}</span>
          </div>
        </div>

        {/* Post Image */}
        <div className="post-image-container">
          <img src={post.postImage} alt="post" className="post-image" />
        </div>

        {/* Post Actions */}
        <div className="post-actions">
          <button
            className={`action-btn like-btn ${post.liked ? 'liked' : ''}`}
            onClick={() => toggleLike(post.id)}
          >
            <img src={post.liked ? '/l.png' : '/leaf.png'} alt="like" className="action-icon" />
          </button>
          <button className="action-btn comment-btn">
            <img src="/cmnt.png" alt="comment" className="action-icon" />
          </button>
          <button className="action-btn share-btn">
            <img src="/send.png" alt="share" className="action-icon" />
          </button>
        </div>

        {/* Likes Count */}
        <div className="likes-info">
          <span className="likes-count">{post.likes} likes</span>
        </div>

        {/* Post Caption */}
        <div className="post-caption">
          <p>
            <strong>{post.username}</strong> {post.caption}
          </p>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          {post.comments.length > 0 ? (
            <>
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <strong>{comment.username}</strong> {comment.text}
                </div>
              ))}
              {post.comments.length > 2 && (
                <button className="view-more-comments">
                  View all {post.comments.length} comments
                </button>
              )}
            </>
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Add Comment Input */}
        <div className="add-comment">
          <input
            type="text"
            placeholder="Add a comment..."
            className="comment-input"
          />
          <button className="post-comment-btn">Post</button>
        </div>
      </div>
    );
  };

  return (
    <div className="social-page">
      {/* Fixed Header */}
      <header className="social-fixed-header">
        <div className="social-header-content">
          <div className="social-logo">🌿 Fyto</div>
          <div className="social-header-actions">
            <span className="header-welcome">Plant Community</span>
          </div>
        </div>
      </header>

      {/* Left Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? '|>' : '<|'}
          </button>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('home');
              setShowSearchResults(false);
            }}
          >
            <img src="/home.png" alt="home" className="nav-icon-img" />
            <span className="nav-label">Home</span>
          </button>

          <button
            className={`nav-item ${activeNav === 'search' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('search');
              setShowSearchResults(!showSearchResults);
            }}
          >
            <img src="/search.png" alt="search" className="nav-icon-img" />
            <span className="nav-label">Search</span>
          </button>

          <button
            className={`nav-item ${activeNav === 'notifications' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('notifications');
              setShowSearchResults(false);
            }}
          >
            <img src="/notification.png" alt="notifications" className="nav-icon-img" />
            <span className="nav-label">Notifications</span>
          </button>
        </nav>
      </div>

      {/* Search Panel */}
      {showSearchResults && (
        <div className="search-panel">
          <div className="search-header">
            <input
              type="text"
              placeholder="Search plants, users, topics..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              className="search-close-btn"
              onClick={() => setShowSearchResults(false)}
              title="Close search"
            >
              ✕
            </button>
          </div>
          <div className="search-results">
            {searchQuery ? (
              <div className="search-message">
                Searching for: <strong>{searchQuery}</strong>
              </div>
            ) : (
              <div className="search-message">
                Try searching for plants, users, or topics!
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modal for Creating Post */}
      {showCreatePostModal && (
        <div className="modal-overlay" onClick={() => setShowCreatePostModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Post</h2>
              <button
                className="close-btn"
                onClick={() => setShowCreatePostModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label htmlFor="imageInput">Select Image</label>
                <div className="image-upload-area">
                  {newPostData.imagePreview ? (
                    <div className="image-preview">
                      <img src={newPostData.imagePreview} alt="preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() =>
                          setNewPostData({
                            ...newPostData,
                            image: null,
                            imagePreview: null,
                          })
                        }
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="imageInput" className="upload-label">
                      <img src="/camera.png" alt="camera" className="upload-icon" />
                      <p>Click to select image from your device</p>
                      <input
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="caption">Caption</label>
                <textarea
                  id="caption"
                  placeholder="Share your plant story! Ask questions, show off your plants, give tips & advice. #PlantCommunity"
                  value={newPostData.caption}
                  onChange={(e) =>
                    setNewPostData({ ...newPostData, caption: e.target.value })
                  }
                  rows="4"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreatePostModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="feed-container">
        {/* Create Post Section */}
        <div className="create-post-section">
          <div className="create-post-container">
            <img
              src="/boy.png"
              alt="user"
              className="create-post-avatar"
            />
            <button
              className="create-post-input"
              onClick={() => setShowCreatePostModal(true)}
            >
              Share your plant journey...
            </button>
          </div>
          <button
            className="create-post-btn"
            onClick={() => setShowCreatePostModal(true)}
          >
            <img src="/plus.png" alt="create" className="plus-icon" />
            Create Post
          </button>
        </div>

        <div className="posts-feed">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;

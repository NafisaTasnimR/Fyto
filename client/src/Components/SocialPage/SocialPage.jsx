import React, { useState } from 'react';
import './SocialPage.css';

const SocialPage = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostData, setNewPostData] = useState({
    caption: '',
    image: null,
    imagePreview: null,
  });

  // Sample posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'john_doe',
      userAvatar: 'https://via.placeholder.com/40',
      postImage: 'https://via.placeholder.com/500x400',
      likes: 245,
      caption: 'Beautiful sunset at the beach 🌅 #travel #nature',
      timestamp: '2 hours ago',
      liked: false,
      comments: [
        { id: 1, username: 'jane_smith', text: 'Amazing view!' },
        { id: 2, username: 'mike_wilson', text: 'I need to visit this place!' },
      ],
    },
    {
      id: 2,
      username: 'sarah_travels',
      userAvatar: 'https://via.placeholder.com/40',
      postImage: 'https://via.placeholder.com/500x400',
      likes: 532,
      caption: 'Coffee and mountains ☕🏔️ #morningvibes',
      timestamp: '5 hours ago',
      liked: false,
      comments: [
        { id: 1, username: 'alex_photo', text: 'Perfect composition!' },
      ],
    },
    {
      id: 3,
      username: 'nature_explorer',
      userAvatar: 'https://via.placeholder.com/40',
      postImage: 'https://via.placeholder.com/500x400',
      likes: 892,
      caption: 'Forest adventures 🌲 #hiking #outdoor',
      timestamp: '1 day ago',
      liked: false,
      comments: [],
    },
    {
      id: 4,
      username: 'food_lover',
      userAvatar: 'https://via.placeholder.com/40',
      postImage: 'https://via.placeholder.com/500x400',
      likes: 421,
      caption: 'Delicious homemade pasta 🍝 #foodstagram #cooking',
      timestamp: '1 day ago',
      liked: false,
      comments: [
        { id: 1, username: 'chef_marco', text: 'Looks so tasty!' },
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
      userAvatar: 'https://via.placeholder.com/40',
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
            ❤️ Like
          </button>
          <button className="action-btn comment-btn">💬 Comment</button>
          <button className="action-btn share-btn">↗️ Share</button>
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
                      <div className="upload-icon">📸</div>
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
                  placeholder="Write a caption... (add hashtags and emojis)"
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

      <div className="feed-container">
        {/* Create Post Section */}
        <div className="create-post-section">
          <div className="create-post-container">
            <img
              src="https://via.placeholder.com/40"
              alt="user"
              className="create-post-avatar"
            />
            <button
              className="create-post-input"
              onClick={() => setShowCreatePostModal(true)}
            >
              What's on your mind?
            </button>
          </div>
          <button
            className="create-post-btn"
            onClick={() => setShowCreatePostModal(true)}
          >
            ➕ Create Post
          </button>
        </div>

        <div className="posts-feed">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialPage;

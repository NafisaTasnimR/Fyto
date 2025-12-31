import React, { useState } from 'react';
import './SocialPage.css';

const SocialPage = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [activeNav, setActiveNav] = useState('home');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [newPostData, setNewPostData] = useState({
    caption: '',
    image: null,
    imagePreview: null,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      username: 'garden_guru',
      userAvatar: '/g.png',
      action: 'liked your post',
      timestamp: 'now',
      read: false,
    },
    {
      id: 2,
      type: 'comment',
      username: 'plant_scientist',
      userAvatar: '/m.png',
      action: 'commented on your post',
      timestamp: '5 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'follow',
      username: 'succulent_queen',
      userAvatar: '/g1.jpg',
      action: 'started following you',
      timestamp: '1 hour ago',
      read: true,
    },
    {
      id: 4,
      type: 'like',
      username: 'veggie_grower',
      userAvatar: '/g2.jpg',
      action: 'liked your post',
      timestamp: '2 hours ago',
      read: true,
    },
    {
      id: 5,
      type: 'comment',
      username: 'jungle_lover',
      userAvatar: '/g3.jpg',
      action: 'commented on your post',
      timestamp: '1 day ago',
      read: true,
    },
  ]);

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

  const [replyInputs, setReplyInputs] = useState({});
  const [openReply, setOpenReply] = useState({ postId: null, commentId: null });

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

  const toggleReply = (postId, commentId) => {
    if (openReply.postId === postId && openReply.commentId === commentId) {
      setOpenReply({ postId: null, commentId: null });
    } else {
      setOpenReply({ postId, commentId });
    }
  };

  const handleReplyChange = (postId, commentId, value) => {
    setReplyInputs({ ...replyInputs, [`${postId}-${commentId}`]: value });
  };

  const submitReply = (postId, commentId) => {
    const key = `${postId}-${commentId}`;
    const text = (replyInputs[key] || '').trim();
    if (!text) return;

    setPosts((prevPosts) => {
      const newPosts = prevPosts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.map((c) =>
            c.id === commentId
              ? { ...c, replies: [...(c.replies || []), { id: Date.now(), username: 'You', text }] }
              : c
          ),
        };
      });

      if (activeCommentsPost && activeCommentsPost.id === postId) {
        const updated = newPosts.find((p) => p.id === postId);
        setActiveCommentsPost(updated);
      }

      return newPosts;
    });

    setReplyInputs({ ...replyInputs, [key]: '' });
    setOpenReply({ postId: null, commentId: null });
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    
    if (!newPostData.caption.trim() && !newPostData.image) {
      alert('Please write something or add an image');
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

        {/* Post Image - Only show if image exists */}
        {post.postImage && (
          <div className="post-image-container">
            <img src={post.postImage} alt="post" className="post-image" />
          </div>
        )}

        {/* Post Caption (moved before actions) */}
        <div className="post-caption">
          <p>
            <strong>{post.username}</strong> {post.caption}
          </p>
        </div>

        <div className="post-actions">
          <button
            className={`action-btn like-btn ${post.liked ? 'liked' : ''}`}
            onClick={() => toggleLike(post.id)}
          >
            <img src={post.liked ? '/l.png' : '/leaf.png'} alt="like" className="action-icon" />
          </button>
          <button
            className="action-btn comment-btn"
            onClick={() => {
              setActiveCommentsPost(post);
              setShowCommentsModal(true);
            }}
          >
            <img src="/cmnt.png" alt="comment" className="action-icon" />
          </button>
          <button className="action-btn share-btn">
            <img src="/send.png" alt="share" className="action-icon" />
          </button>
        </div>

        <div className="likes-info">
          <span className="likes-count">{post.likes} likes</span>
        </div>

        <div className="comments-section">
          {post.comments.length > 0 ? (
            <>
              {post.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-main">
                    <strong>{comment.username}</strong> {comment.text}
                    <button
                      className="reply-btn"
                      onClick={() => toggleReply(post.id, comment.id)}
                      title="Reply"
                    >
                      Reply
                    </button>
                  </div>

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                      {comment.replies.map((r) => (
                        <div key={r.id} className="comment-reply">
                          <strong>{r.username}</strong> {r.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {openReply.postId === post.id && openReply.commentId === comment.id && (
                    <div className="reply-composer">
                      <input
                        type="text"
                        placeholder={`Reply to ${comment.username}...`}
                        value={replyInputs[`${post.id}-${comment.id}`] || ''}
                        onChange={(e) => handleReplyChange(post.id, comment.id, e.target.value)}
                        className="reply-input"
                      />
                      <button
                        className="reply-send"
                        onClick={() => submitReply(post.id, comment.id)}
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {post.comments.length > 2 && (
                <button
                  className="view-more-comments"
                  onClick={() => {
                    setActiveCommentsPost(post);
                    setShowCommentsModal(true);
                  }}
                >
                  View all {post.comments.length} comments
                </button>
              )}
            </>
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>

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
      <header className="social-fixed-header">
        <div className="social-header-content">
          <div className="social-logo">🌿 Fyto</div>
          <div className="social-header-actions">
            <span className="header-welcome">Plant Community</span>
          </div>
        </div>
      </header>

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
              setShowNotifications(false);
            }}
          >
            <img src="/search.png" alt="search" className="nav-icon-img" />
            <span className="nav-label">Search</span>
          </button>

          <button
            className={`nav-item ${activeNav === 'notifications' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('notifications');
              setShowNotifications(!showNotifications);
              setShowSearchResults(false);
            }}
          >
            <img src="/notification.png" alt="notifications" className="nav-icon-img" />
            <span className="nav-label">Notifications</span>
          </button>
        </nav>
      </div>

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

      {showCommentsModal && activeCommentsPost && (
        <div className="modal-overlay" onClick={() => { setShowCommentsModal(false); setActiveCommentsPost(null); }}>
          <div className="modal-content comments-style" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{activeCommentsPost.username}'s Post</h2>
              <button
                className="close-btn"
                onClick={() => { setShowCommentsModal(false); setActiveCommentsPost(null); }}
                title="Close comments"
              >
                ✕
              </button>
            </div>

            <div className="comments-list">
              {activeCommentsPost.comments && activeCommentsPost.comments.length > 0 ? (
                activeCommentsPost.comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <img src="/girl.png" alt={c.username} className="comment-avatar" />
                    <div className="comment-body">
                      <strong>{c.username}</strong>
                      <p>{c.text}</p>

                      <div className="modal-comment-actions">
                        <button
                          className="reply-btn"
                          onClick={() => toggleReply(activeCommentsPost.id, c.id)}
                        >
                          Reply
                        </button>
                      </div>

                      {c.replies && c.replies.length > 0 && (
                        <div className="comment-replies modal-replies">
                          {c.replies.map((r) => (
                            <div key={r.id} className="comment-reply">
                              <strong>{r.username}</strong> {r.text}
                            </div>
                          ))}
                        </div>
                      )}

                      {openReply.postId === activeCommentsPost.id && openReply.commentId === c.id && (
                        <div className="reply-composer modal-reply-composer">
                          <input
                            type="text"
                            placeholder={`Reply to ${c.username}...`}
                            value={replyInputs[`${activeCommentsPost.id}-${c.id}`] || ''}
                            onChange={(e) => handleReplyChange(activeCommentsPost.id, c.id, e.target.value)}
                            className="reply-input"
                          />
                          <button
                            className="reply-send"
                            onClick={() => submitReply(activeCommentsPost.id, c.id)}
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments yet.</p>
              )}
            </div>

            <div className="comment-composer">
              <input type="text" placeholder="Write a comment..." className="composer-input" />
              <button className="composer-send">➤</button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button
              className="notifications-close-btn"
              onClick={() => setShowNotifications(false)}
              title="Close notifications"
            >
              ✕
            </button>
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                >
                  <img src={notif.userAvatar} alt={notif.username} className="notif-avatar" />
                  <div className="notif-content">
                    <p>
                      <strong>{notif.username}</strong> {notif.action}
                    </p>
                    <span className="notif-timestamp">{notif.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="notifications-empty">
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showCreatePostModal && (
        <div className="modal-overlay" onClick={() => setShowCreatePostModal(false)}>
          <div className="modal-content facebook-style" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create post</h2>
              <button
                className="close-btn"
                onClick={() => setShowCreatePostModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="facebook-post-form">
              <div className="text-input-section">
                <textarea
                  placeholder="Share your plant journey..."
                  value={newPostData.caption}
                  onChange={(e) =>
                    setNewPostData({ ...newPostData, caption: e.target.value })
                  }
                  rows="6"
                  className="status-textarea"
                />
              </div>

              <div className="add-to-post-section">
                <p className="add-to-post-label">Add to your post</p>
                <div className="add-to-post-icons">
                  <label htmlFor="imageInput" className="post-action-icon">
                    <img src="/camera.png" alt="photo" className="action-icon-small" />
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {newPostData.imagePreview && (
                <div className="image-preview-section">
                  <div className="image-preview-large">
                    <img src={newPostData.imagePreview} alt="preview" />
                    <button
                      type="button"
                      className="remove-image-btn-large"
                      onClick={() =>
                        setNewPostData({
                          ...newPostData,
                          image: null,
                          imagePreview: null,
                        })
                      }
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="modal-actions facebook-style">
                <button type="button" className="btn-cancel" onClick={() => setShowCreatePostModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-facebook">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="feed-container">
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

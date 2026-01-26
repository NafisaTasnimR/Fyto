import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SocialPage.css';
import Header from '../Shared/Header';
import LeaderBoard from '../LeaderBoard/LeaderBoard';

const SocialPage = () => {
  const navigate = useNavigate();
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [showViewPostModal, setShowViewPostModal] = useState(false);
  const [viewingPost, setViewingPost] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  const [activeNav, setActiveNav] = useState('home');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarForceShadow, setSidebarForceShadow] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  React.useEffect(() => {
    // When panels are closed, briefly force the sidebar to show its shadow
    if (!showSearchResults && !showNotifications) {
      setSidebarForceShadow(true);
      const t = setTimeout(() => setSidebarForceShadow(false), 220);
      return () => clearTimeout(t);
    }
    // if either panel opens, ensure force-shadow is disabled
    setSidebarForceShadow(false);
  }, [showSearchResults, showNotifications]);
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

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setPostsError('Please login to view posts');
        setLoading(false);
        return;
      }

      // Decode token to get user ID
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentUserId = payload._id;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (!response.data.posts || response.data.posts.length === 0) {
          setPosts([]);
          setPostsError(response.data.message || 'No posts available');
          setLoading(false);
          return;
        }

        const formattedPosts = response.data.posts.map(post => ({
          id: post._id,
          username: post.authorId?.username || 'Unknown User',
          userAvatar: post.authorId?.profilePic || '/boy.png',
          postImage: post.images && post.images.length > 0 ? post.images[0] : null,
          likes: post.likes?.length || 0,
          caption: post.content || '',
          timestamp: formatTimestamp(post.createdAt),
          liked: post.likes?.includes(currentUserId) || false,
          comments: [],
        }));
        setPosts(formattedPosts);
        setPostsError(null);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPostsError(err.response?.data?.message || 'Failed to load posts');
      setLoading(false);
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return postDate.toLocaleDateString();
  };

  // Search functionality
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      setSearchLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No authentication token found');
        setSearchLoading(false);
        return;
      }

      // Call both search endpoints in parallel
      const [usersResponse, postsResponse] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/search?query=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).catch(err => {
          console.error('Error fetching users:', err);
          return { data: { success: false, users: [] } };
        }),
        axios.get(
          `${process.env.REACT_APP_API_URL}/posts/search?query=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).catch(err => {
          console.error('Error fetching posts:', err);
          return { data: { success: false, posts: [] } };
        })
      ]);

      const users = usersResponse.data.success ? (usersResponse.data.users || []) : [];
      const posts = postsResponse.data.success ? (postsResponse.data.posts || []) : [];

      // Combine users and posts with type identifiers
      const combinedResults = [
        ...users.map(user => ({ type: 'user', data: user })),
        ...posts.map(post => ({ type: 'post', data: post }))
      ];

      setSearchResults(combinedResults);
      setSearchLoading(false);
    } catch (err) {
      console.error('Error performing search:', err);
      setSearchResults([]);
      setSearchLoading(false);
    }
  };

  const [replyInputs, setReplyInputs] = useState({});
  const [openReply, setOpenReply] = useState({ postId: null, commentId: null });

  const handleUserClick = (username) => {
    if (username && username !== 'Unknown User') {
      navigate(`/profile/${username}`);
    }
  };

  const handleViewPost = (post) => {
    // Get current user ID from token
    const token = localStorage.getItem('token');
    let currentUserId = null;
    if (token) {
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        currentUserId = payload._id;
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }

    // Format the post for display
    const formattedPost = {
      id: post._id,
      username: post.authorId?.username || 'Unknown User',
      userAvatar: post.authorId?.profilePic || '/boy.png',
      postImage: post.images && post.images.length > 0 ? post.images[0] : null,
      likes: post.likes?.length || 0,
      caption: post.content || '',
      timestamp: formatTimestamp(post.createdAt),
      liked: currentUserId ? (post.likes?.includes(currentUserId) || false) : false,
      comments: [],
    };
    setViewingPost(formattedPost);
    setShowViewPostModal(true);
    setShowSearchResults(false);
  };

  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                ...post,
                liked: response.data.isLiked,
                likes: response.data.likesCount,
              }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
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

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPostData.caption.trim() && !newPostData.image) {
      alert('Please write something or add an image');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const postData = {
        content: newPostData.caption,
        images: newPostData.imagePreview ? [newPostData.imagePreview] : [],
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        const newPost = {
          id: response.data.post._id,
          username: response.data.post.authorId?.username || 'You',
          userAvatar: response.data.post.authorId?.profilePic || '/boy.png',
          postImage: response.data.post.images && response.data.post.images.length > 0 ? response.data.post.images[0] : null,
          likes: 0,
          caption: response.data.post.content,
          timestamp: 'now',
          liked: false,
          comments: [],
        };

        setPosts([newPost, ...posts]);
        setNewPostData({ caption: '', image: null, imagePreview: null });
        setShowCreatePostModal(false);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file);
    }
  };

  const compressImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

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
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

        setNewPostData({
          ...newPostData,
          image: file,
          imagePreview: compressedBase64,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const Post = ({ post }) => {
    return (
      <div className="post">
        {/* Post Header */}
        <div className="post-header">
          <img
            src={post.userAvatar}
            alt={post.username}
            className="avatar"
            onClick={() => handleUserClick(post.username)}
            style={{ cursor: 'pointer' }}
          />
          <div className="header-info">
            <h3
              className="username"
              onClick={() => handleUserClick(post.username)}
              style={{ cursor: 'pointer' }}
            >
              {post.username}
            </h3>
            <span className="timestamp">{post.timestamp}</span>
          </div>
        </div>

        {/* Post Image - Only show if image exists */}
        {post.postImage && (
          <div
            className="post-image-container"
            onClick={(e) => {
              e.stopPropagation();
              setViewingImage(post.postImage);
              setShowImageViewer(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            <img src={post.postImage} alt="post" className="post-image" />
          </div>
        )}

        {/* Post Caption (moved before actions) */}
        <div
          className="post-caption"
          onClick={() => {
            setViewingPost(post);
            setShowViewPostModal(true);
          }}
          style={{ cursor: 'pointer' }}
        >
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
      <Header />

      <div
        className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarForceShadow ? 'force-shadow' : ''}`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeNav === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('home');
              setShowSearchResults(false);
              setShowNotifications(false);
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
        <div className="search-panel overlay">
          <div className="search-header">
            <input
              type="text"
              placeholder="Search users by username..."
              className="search-input1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button
              className="search-close-btn"
              onClick={() => {
                setShowSearchResults(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
              title="Close search"
            >
              ✕
            </button>
          </div>
          <div className="search-results">
            {searchLoading ? (
              <div className="search-message">Searching...</div>
            ) : !searchQuery ? (
              <div className="search-message">
                Search for users and posts
              </div>
            ) : searchResults.length > 0 ? (
              <>
                {searchResults.filter(item => item.type === 'user').length > 0 && (
                  <>
                    <div className="search-section-title">Users</div>
                    {searchResults
                      .filter(item => item.type === 'user')
                      .map((item) => (
                        <div
                          key={item.data._id}
                          className="user-item"
                          onClick={() => handleUserClick(item.data.username)}
                        >
                          <img
                            src={item.data.profilePic || '/boy.png'}
                            alt={item.data.username}
                            className="user-avatar"
                          />
                          <div className="user-info">
                            <div className="user-name">{item.data.name}</div>
                            <div className="user-username">@{item.data.username}</div>
                          </div>
                        </div>
                      ))}
                  </>
                )}
                {searchResults.filter(item => item.type === 'post').length > 0 && (
                  <>
                    <div className="search-section-title">Posts</div>
                    {searchResults
                      .filter(item => item.type === 'post')
                      .map((item) => (
                        <div
                          key={item.data._id}
                          className="post-item-search"
                          onClick={() => handleViewPost(item.data)}
                        >
                          <div
                            className="post-search-header"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(item.data.authorId?.username);
                            }}
                          >
                            <img
                              src={item.data.authorId?.profilePic || '/boy.png'}
                              alt={item.data.authorId?.username}
                              className="user-avatar-small"
                            />
                            <div className="post-search-info">
                              <div className="user-name">{item.data.authorId?.name}</div>
                              <div className="user-username">@{item.data.authorId?.username}</div>
                            </div>
                          </div>
                          <div className="post-search-content">{item.data.content}</div>
                          {item.data.images && item.data.images.length > 0 && (
                            <img
                              src={item.data.images[0]}
                              alt="Post"
                              className="post-search-image"
                            />
                          )}
                        </div>
                      ))}
                  </>
                )}
              </>
            ) : (
              <div className="search-message">
                No results found for "<strong>{searchQuery}</strong>"
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

      {showViewPostModal && viewingPost && (
        <div className="modal-overlay" onClick={() => { setShowViewPostModal(false); setViewingPost(null); }}>
          <div className="modal-content view-post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post</h2>
              <button
                className="close-btn"
                onClick={() => { setShowViewPostModal(false); setViewingPost(null); }}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="view-post-content">
              <div className="post-header">
                <img
                  src={viewingPost.userAvatar}
                  alt={viewingPost.username}
                  className="post-avatar"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserClick(viewingPost.username);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <div className="post-user-info">
                  <strong
                    className="post-username"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(viewingPost.username);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {viewingPost.username}
                  </strong>
                  <span className="post-timestamp">{viewingPost.timestamp}</span>
                </div>
              </div>

              {viewingPost.postImage && (
                <div
                  className="post-image-container"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewingImage(viewingPost.postImage);
                    setShowImageViewer(true);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={viewingPost.postImage} alt="post" className="post-image" />
                </div>
              )}

              <div className="post-caption">
                <p>
                  <strong>{viewingPost.username}</strong> {viewingPost.caption}
                </p>
              </div>

              <div className="post-actions">
                <button
                  className={`action-btn like-btn ${viewingPost.liked ? 'liked' : ''}`}
                  onClick={() => toggleLike(viewingPost.id)}
                >
                  <img src={viewingPost.liked ? '/l.png' : '/leaf.png'} alt="like" className="action-icon" />
                </button>
                <button
                  className="action-btn comment-btn"
                  onClick={() => {
                    setActiveCommentsPost(viewingPost);
                    setShowCommentsModal(true);
                    setShowViewPostModal(false);
                  }}
                >
                  <img src="/cmnt.png" alt="comment" className="action-icon" />
                </button>
                <button className="action-btn share-btn">
                  <img src="/send.png" alt="share" className="action-icon" />
                </button>
              </div>

              <div className="likes-info">
                <span className="likes-count">{viewingPost.likes} likes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="notifications-panel overlay">
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
            {loading ? (
              <div className="loading-message">
                <p>Loading posts...</p>
              </div>
            ) : postsError ? (
              <div className="error-message">
                <p>{postsError}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="no-posts-message">
                <p>No posts yet. Be the first to share your plant journey!</p>
              </div>
            ) : (
              posts.map((post) => (
                <Post key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className={`right-sidebar ${rightSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="right-sidebar-header">
          <button
            className="right-sidebar-toggle-btn"
            onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          >
            <img src="/trophy.png" alt="" className="trophy-icon" />
            <span className="right-sidebar-label">Leaderboard</span>
          </button>
        </div>
        <div className="right-sidebar-content">
          <LeaderBoard />
        </div>
      </div>

      {/* Full-Screen Image Viewer */}
      {showImageViewer && viewingImage && (
        <div
          className="image-viewer-overlay"
          onClick={() => {
            setShowImageViewer(false);
            setViewingImage(null);
          }}
        >
          <button
            className="image-viewer-close"
            onClick={() => {
              setShowImageViewer(false);
              setViewingImage(null);
            }}
            title="Close"
          >
            ✕
          </button>
          <div className="image-viewer-content" onClick={(e) => e.stopPropagation()}>
            <img src={viewingImage} alt="Full size" className="image-viewer-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPage;

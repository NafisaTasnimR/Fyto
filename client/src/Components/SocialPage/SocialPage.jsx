import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SocialPage.css';
import Header from '../Shared/Header';
import Loader from '../Shared/Loader';
import EmptyState from '../Shared/EmptyState';
import LeaderBoard from '../LeaderBoard/LeaderBoard';
import { getCurrentUser } from '../../services/authService';
import { getProfilePic } from '../../utils/imageUtils';

// ─── Post defined OUTSIDE SocialPage to prevent remount on every render (fixes input focus glitch) ───
const Post = ({
  post,
  openPostMenuId, setOpenPostMenuId,
  handleUserClick,
  setViewingImage, setShowImageViewer,
  setViewingPost, setShowViewPostModal,
  toggleLike,
  openCommentsModal,
  setActiveSharePost, setShowShareModal,
  handleReportClick,
  toggleReply, openReply,
  replyInputs, handleReplyChange, submitReply,
  commentInputs, setCommentInputs, submitComment,
  onLikesClick,
}) => {
  return (
    <div className="post">
      <div className="post-header">
        <img
          src={post.userAvatar}
          alt={post.username}
          className="avatar"
          onClick={() => handleUserClick(post.authorUserId)}
          style={{ cursor: 'pointer' }}
        />
        <div className="header-info">
          <h3
            className="username"
            onClick={() => handleUserClick(post.authorUserId)}
            style={{ cursor: 'pointer' }}
          >
            {post.username}
          </h3>
          <span className="timestamp">{post.timestamp}</span>
        </div>
        <div className="post-menu-container">
          <button
            className="post-menu-btn"
            onClick={() => setOpenPostMenuId(openPostMenuId === post.id ? null : post.id)}
          >
            ⋮
          </button>
          {openPostMenuId === post.id && (
            <div className="post-menu-dropdown">
              <button className="post-menu-item" onClick={() => handleReportClick(post)}>
                Report
              </button>
            </div>
          )}
        </div>
      </div>

      {post.postImage && (
        <div
          className="post-image-container"
          onClick={(e) => { e.stopPropagation(); setViewingImage(post.postImage); setShowImageViewer(true); }}
          style={{ cursor: 'pointer' }}
        >
          <img src={post.postImage} alt="post" className="post-image" />
        </div>
      )}

      <div
        className="post-caption"
        onClick={() => { setViewingPost(post); setShowViewPostModal(true); }}
        style={{ cursor: 'pointer' }}
      >
        <p><strong>{post.username}</strong> {post.caption}</p>
      </div>

      <div className="post-actions">
        <button
          className={`action-btn like-btn ${post.liked ? 'liked' : ''}`}
          onClick={() => toggleLike(post.id)}
        >
          <img src={post.liked ? '/l.png' : '/leaf.png'} alt="like" className="action-icon" />
        </button>
        <button className="action-btn comment-btn" onClick={() => openCommentsModal(post)}>
          <img src="/cmnt.png" alt="comment" className="action-icon" />
          {post.commentsCount !== null && post.commentsCount > 0 && (
            <span className="action-count">{post.commentsCount}</span>
          )}
        </button>
        <button
          className="action-btn share-btn"
          onClick={() => { setActiveSharePost(post); setShowShareModal(true); }}
        >
          <img src="/send.png" alt="share" className="action-icon" />
        </button>
      </div>

      <div className="likes-info">
        <span
          className="likes-count"
          onClick={() => post.likes > 0 && onLikesClick(post)}
          style={post.likes > 0 ? { cursor: 'pointer' } : {}}
        >{post.likes} likes</span>
      </div>

      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          className="comment-input"
          value={commentInputs[post.id] || ''}
          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submitComment(post.id, commentInputs[post.id] || '');
              setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
            }
          }}
        />
        <button
          className="post-comment-btn"
          onClick={() => {
            submitComment(post.id, commentInputs[post.id] || '');
            setCommentInputs((prev) => ({ ...prev, [post.id]: '' }));
          }}
        >Post</button>
      </div>
    </div>
  );
};

const SocialPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [highlightedReplyId, setHighlightedReplyId] = useState(null);
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
  // eslint-disable-next-line no-unused-vars
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarForceShadow, setSidebarForceShadow] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeSharePost, setActiveSharePost] = useState(null);
  const [openPostMenuId, setOpenPostMenuId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingPost, setReportingPost] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likersData, setLikersData] = useState([]);
  const [likersLoading, setLikersLoading] = useState(false);

  const openLikesModal = async (post) => {
    setShowLikesModal(true);
    if (!post.likerIds || post.likerIds.length === 0) {
      setLikersData([]);
      return;
    }
    setLikersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const results = await Promise.all(
        post.likerIds.map(async (userId) => {
          try {
            const res = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/users/${userId}/profile`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data?.data?.user || null;
          } catch {
            return null;
          }
        })
      );
      setLikersData(results.filter(Boolean));
    } catch {
      setLikersData([]);
    }
    setLikersLoading(false);
  };

  React.useEffect(() => {
    if (!showSearchResults && !showNotifications) {
      setSidebarForceShadow(true);
      const t = setTimeout(() => setSidebarForceShadow(false), 220);
      return () => clearTimeout(t);
    }
    setSidebarForceShadow(false);
  }, [showSearchResults, showNotifications]);

  const [newPostData, setNewPostData] = useState({
    caption: '',
    image: null,
    imagePreview: null,
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    fetchPosts();
    getCurrentUser().then(res => setCurrentUser(res.data)).catch(() => {});
    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openPostMenuId && !event.target.closest('.post-menu-container')) {
        setOpenPostMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openPostMenuId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setPostsError('Please login to view posts');
        setLoading(false);
        return;
      }

      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentUserId = payload._id;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        if (!response.data.posts || response.data.posts.length === 0) {
          setPosts([]);
          setPostsError(null);
          setLoading(false);
          return;
        }

        const formattedPosts = response.data.posts.filter(post => post.visibility !== 'private').map(post => ({
          id: post._id,
          username: post.authorId?.username || 'Unknown User',
          userAvatar: getProfilePic(post.authorId?.profilePic),
          authorUserId: post.authorId?._id || null,
          postImage: post.images && post.images.length > 0 ? post.images[0] : null,
          likes: post.likes?.length || 0,
          likerIds: post.likes || [],
          caption: post.content || '',
          timestamp: formatTimestamp(post.createdAt),
          liked: post.likes?.includes(currentUserId) || false,
          comments: [],
          commentsCount: null,
        }));
        setPosts(formattedPosts);
        setPostsError(null);

        const commentData = await Promise.all(
          formattedPosts.map(async (post) => {
            try {
              const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/posts/${post.id}/comments`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (res.data.success) {
                const comments = res.data.comments || [];
                const totalCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);
                return { id: post.id, comments, commentsCount: totalCount };
              }
            } catch {}
            return { id: post.id, comments: [], commentsCount: 0 };
          })
        );
        setPosts(prev => prev.map(p => {
          const data = commentData.find(d => d.id === p.id);
          return data ? { ...p, comments: data.comments, commentsCount: data.commentsCount } : p;
        }));
      } else {
        setPostsError(response.data.message || 'Failed to load posts');
      }
      setLoading(false);
    } catch (err) {
      setPostsError(err.response?.data?.message || 'Failed to load posts. Please check your connection.');
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.postId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/notifications/${notif._id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => {});
      setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));

      const postRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/${notif.postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!postRes.data.success) return;
      const post = postRes.data.post;
      setShowNotifications(false);

      if (notif.type === 'comment' || notif.type === 'reply') {
        const comments = await fetchComments(post._id);
        let sortedComments = comments;
        let replyToHighlight = null;
        if (notif.type === 'reply' && notif.commentId) {
          const replyIdStr = notif.commentId.toString();
          const parentIdx = comments.findIndex(c =>
            c.replies?.some(r => r._id?.toString() === replyIdStr)
          );
          if (parentIdx > 0) {
            sortedComments = [comments[parentIdx], ...comments.filter((_, i) => i !== parentIdx)];
          }
          replyToHighlight = replyIdStr;
        }
        const formattedPost = {
          id: post._id, _id: post._id,
          username: post.authorId?.username || 'Unknown User',
          userAvatar: getProfilePic(post.authorId?.profilePic),
          authorUserId: post.authorId?._id || null,
          postImage: post.images && post.images.length > 0 ? post.images[0] : null,
          likes: post.likes?.length || 0,
          caption: post.content || '',
          timestamp: formatTimestamp(post.createdAt),
          comments: sortedComments,
        };
        setHighlightedReplyId(replyToHighlight);
        setActiveCommentsPost(formattedPost);
        setShowCommentsModal(true);
        setModalCommentInput('');
      } else {
        let currentUserId = null;
        try {
          const tokenParts = token.split('.');
          const p = JSON.parse(atob(tokenParts[1]));
          currentUserId = p._id;
        } catch (e) {}
        const formattedPost = {
          id: post._id,
          username: post.authorId?.username || 'Unknown User',
          userAvatar: getProfilePic(post.authorId?.profilePic),
          authorUserId: post.authorId?._id || null,
          postImage: post.images && post.images.length > 0 ? post.images[0] : null,
          likes: post.likes?.length || 0,
          caption: post.content || '',
          timestamp: formatTimestamp(post.createdAt),
          liked: currentUserId ? (post.likes?.includes(currentUserId) || false) : false,
          comments: [],
        };
        setViewingPost(formattedPost);
        setShowViewPostModal(true);
      }
    } catch (err) {
      console.error('Error handling notification click:', err);
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
      if (!token) { setSearchLoading(false); return; }

      const [usersResponse, postsResponse] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/search?query=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(() => ({ data: { success: false, users: [] } })),
        axios.get(
          `${process.env.REACT_APP_API_URL}/api/posts/search?query=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(() => ({ data: { success: false, posts: [] } }))
      ]);

      const users = usersResponse.data.success ? (usersResponse.data.users || []) : [];
      const posts = postsResponse.data.success ? (postsResponse.data.posts || []) : [];
      setSearchResults([
        ...users.map(user => ({ type: 'user', data: user })),
        ...posts.map(post => ({ type: 'post', data: post }))
      ]);
      setSearchLoading(false);
    } catch (err) {
      setSearchResults([]);
      setSearchLoading(false);
    }
  };

  const [replyInputs, setReplyInputs] = useState({});
  const [openReply, setOpenReply] = useState({ postId: null, commentId: null });
  const [commentInputs, setCommentInputs] = useState({});
  const [modalCommentInput, setModalCommentInput] = useState('');

  const handleUserClick = (userId) => {
    if (userId) navigate(`/user/${userId}`);
  };

  const handleViewPost = (post) => {
    const token = localStorage.getItem('token');
    let currentUserId = null;
    if (token) {
      try {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        currentUserId = payload._id;
      } catch (err) {}
    }
    const formattedPost = {
      id: post._id,
      username: post.authorId?.username || 'Unknown User',
      userAvatar: getProfilePic(post.authorId?.profilePic),
      authorUserId: post.authorId?._id || null,
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
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setPosts(posts.map((post) =>
          post.id === postId
            ? { ...post, liked: response.data.isLiked, likes: response.data.likesCount }
            : post
        ));
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

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) return response.data.comments;
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
    return [];
  };

  const submitComment = async (postId, content) => {
    if (!content.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`,
        { content: content.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const newComment = { ...response.data.comment, replies: [] };
        setPosts((prev) => prev.map((p) =>
          p.id === postId ? { ...p, comments: [newComment, ...(p.comments || [])], commentsCount: (p.commentsCount ?? 0) + 1 } : p
        ));
        setActiveCommentsPost((prev) =>
          prev && prev.id === postId
            ? { ...prev, comments: [newComment, ...(prev.comments || [])], commentsCount: (prev.commentsCount ?? 0) + 1 }
            : prev
        );
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const openCommentsModal = async (post) => {
    const comments = await fetchComments(post.id);
    const totalCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);
    setPosts((prev) => prev.map((p) =>
      p.id === post.id ? { ...p, comments, commentsCount: totalCount } : p
    ));
    setActiveCommentsPost({ ...post, comments, commentsCount: totalCount });
    setShowCommentsModal(true);
    setModalCommentInput('');
  };

  const submitReply = async (postId, commentId) => {
    const key = `${postId}-${commentId}`;
    const text = (replyInputs[key] || '').trim();
    if (!text) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comments/${commentId}/replies`,
        { content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const newReply = response.data.comment;
        setPosts((prevPosts) => prevPosts.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            commentsCount: (post.commentsCount ?? 0) + 1,
            comments: post.comments.map((c) =>
              c._id === commentId ? { ...c, replies: [...(c.replies || []), newReply] } : c
            ),
          };
        }));
        setActiveCommentsPost((prev) => {
          if (!prev || prev.id !== postId) return prev;
          return {
            ...prev,
            commentsCount: (prev.commentsCount ?? 0) + 1,
            comments: prev.comments.map((c) =>
              c._id === commentId ? { ...c, replies: [...(c.replies || []), newReply] } : c
            ),
          };
        });
        setReplyInputs({ ...replyInputs, [key]: '' });
        setOpenReply({ postId: null, commentId: null });
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setPosts((prevPosts) => prevPosts.map((post) => {
          if (post.id !== postId) return post;
          return {
            ...post,
            comments: post.comments.filter((c) => c._id !== commentId),
            commentsCount: Math.max(0, (post.commentsCount ?? 0) - 1),
          };
        }));
        setActiveCommentsPost((prev) => {
          if (!prev || prev.id !== postId) return prev;
          return {
            ...prev,
            comments: prev.comments.filter((c) => c._id !== commentId),
            commentsCount: Math.max(0, (prev.commentsCount ?? 0) - 1),
          };
        });
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
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
        `${process.env.REACT_APP_API_URL}/api/posts`,
        postData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        const newPost = {
          id: response.data.post._id,
          username: response.data.post.authorId?.username || 'You',
          userAvatar: getProfilePic(response.data.post.authorId?.profilePic),
          authorUserId: response.data.post.authorId?._id || currentUser?._id || null,
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
    if (file) compressImage(file);
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
          if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        } else {
          if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setNewPostData({ ...newPostData, image: file, imagePreview: compressedBase64 });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleReportClick = (post) => {
    setReportingPost(post);
    setShowReportModal(true);
    setOpenPostMenuId(null);
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) { alert('Please provide a reason for reporting'); return; }
    if (reportReason.trim().length < 10) { alert('Report reason must be at least 10 characters long.'); return; }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reports/${reportingPost.id}`,
        { reason: reportReason, postType: 'social' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowReportModal(false);
      setReportingPost(null);
      setReportReason('');
      setShowReportSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to report post. Please try again.');
    }
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
            onClick={() => { setActiveNav('home'); setShowSearchResults(false); setShowNotifications(false); }}
          >
            <img src="/home.png" alt="home" className="nav-icon-img" />
            <span className="nav-label">Home</span>
          </button>
          <button
            className={`nav-item ${activeNav === 'search' ? 'active' : ''}`}
            onClick={() => { setActiveNav('search'); setShowSearchResults(!showSearchResults); setShowNotifications(false); }}
          >
            <img src="/search.png" alt="search" className="nav-icon-img" />
            <span className="nav-label">Search</span>
          </button>
          <button
            className={`nav-item ${activeNav === 'notifications' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('notifications');
              const opening = !showNotifications;
              setShowNotifications(opening);
              setShowSearchResults(false);
              if (opening && unreadCount > 0) markAllNotificationsRead();
            }}
          >
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <img src="/notification.png" alt="notifications" className="nav-icon-img" />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: '#e53e3e', color: '#fff', borderRadius: '50%',
                  fontSize: '10px', width: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, lineHeight: 1
                }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </div>
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
              onClick={() => { setShowSearchResults(false); setSearchQuery(''); setSearchResults([]); }}
              title="Close search"
            >✕</button>
          </div>
          <div className="search-results">
            {searchLoading ? (
              <div className="search-message">Searching...</div>
            ) : !searchQuery ? (
              <div className="search-message">Search for users and posts</div>
            ) : searchResults.length > 0 ? (
              <>
                {searchResults.filter(item => item.type === 'user').length > 0 && (
                  <>
                    <div className="search-section-title">Users</div>
                    {searchResults.filter(item => item.type === 'user').map((item) => (
                      <div
                        key={item.data._id}
                        className="user-item"
                        onClick={() => { handleUserClick(item.data._id); setShowSearchResults(false); setSearchQuery(''); setSearchResults([]); }}
                      >
                        <img src={getProfilePic(item.data.profilePic)} alt={item.data.username} className="user-avatar" />
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
                    {searchResults.filter(item => item.type === 'post').map((item) => (
                      <div key={item.data._id} className="post-item-search" onClick={() => handleViewPost(item.data)}>
                        <div className="post-search-header" onClick={(e) => { e.stopPropagation(); handleUserClick(item.data.authorId?._id); }}>
                          <img src={getProfilePic(item.data.authorId?.profilePic)} alt={item.data.authorId?.username} className="user-avatar-small" />
                          <div className="post-search-info">
                            <div className="user-name">{item.data.authorId?.name}</div>
                            <div className="user-username">@{item.data.authorId?.username}</div>
                          </div>
                        </div>
                        <div className="post-search-content">{item.data.content}</div>
                        {item.data.images && item.data.images.length > 0 && (
                          <img src={item.data.images[0]} alt="Post" className="post-search-image" />
                        )}
                      </div>
                    ))}
                  </>
                )}
              </>
            ) : (
              <div className="search-message">No results found for "<strong>{searchQuery}</strong>"</div>
            )}
          </div>
        </div>
      )}

      {showCommentsModal && activeCommentsPost && (
        <div className="modal-overlay" onClick={() => { setShowCommentsModal(false); setActiveCommentsPost(null); setHighlightedReplyId(null); }}>
          <div className="modal-content comments-style" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{activeCommentsPost.username}'s Post</h2>
              <button
                className="close-btn"
                onClick={() => { setShowCommentsModal(false); setActiveCommentsPost(null); setHighlightedReplyId(null); }}
                title="Close comments"
              >✕</button>
            </div>

            <div className="comments-list">
              {activeCommentsPost.comments && activeCommentsPost.comments.length > 0 ? (
                activeCommentsPost.comments.map((c) => {
                  const token = localStorage.getItem('token');
                  let currentUserId = null;
                  if (token) {
                    try {
                      const tokenParts = token.split('.');
                      const payload = JSON.parse(atob(tokenParts[1]));
                      currentUserId = payload._id;
                    } catch (e) {}
                  }
                  const canDeleteComment = currentUserId === c.authorId?._id || currentUserId === activeCommentsPost.authorUserId;

                  return (
                    <div key={c._id} className="comment-item">
                      <img src={getProfilePic(c.authorId?.profilePic)} alt={c.authorId?.username || 'User'} className="comment-avatar" />
                      <div className="comment-body">
                        <strong>{c.authorId?.username || 'User'}</strong>
                        <p>{c.content}</p>

                        <div className="modal-comment-actions">
                          <button className="reply-btn" onClick={() => toggleReply(activeCommentsPost.id, c._id)}>
                            Reply
                          </button>
                          {canDeleteComment && (
                            <button
                              className="delete-comment-btn"
                              onClick={() => handleDeleteComment(c._id, activeCommentsPost.id)}
                              title="Delete comment"
                            >
                              Delete
                            </button>
                          )}
                        </div>

                        {c.replies && c.replies.length > 0 && (
                          <div className="comment-replies modal-replies">
                            {c.replies.map((r) => (
                              <div
                                key={r._id}
                                className={`comment-reply${r._id?.toString() === highlightedReplyId ? ' highlighted-reply' : ''}`}
                              >
                                <img
                                  src={getProfilePic(r.authorId?.profilePic)}
                                  alt={r.authorId?.username || 'User'}
                                  className="comment-avatar-reply"
                                />
                                <div className="comment-reply-body" style={{ flex: 1 }}>
                                  <strong style={{ fontSize: '13px' }}>{r.authorId?.username || 'User'}</strong>
                                  <span style={{ fontSize: '13px', color: '#444', marginLeft: '6px' }}>{r.content}</span>
                                </div>
                                {canDeleteComment && (
                                  <button
                                    className="delete-comment-btn"
                                    onClick={() => handleDeleteComment(r._id, activeCommentsPost.id)}
                                    title="Delete reply"
                                  >Delete</button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {openReply.postId === activeCommentsPost.id && openReply.commentId === c._id && (
                          <div className="reply-composer modal-reply-composer">
                            <input
                              type="text"
                              placeholder={`Reply to ${c.authorId?.username || 'user'}...`}
                              value={replyInputs[`${activeCommentsPost.id}-${c._id}`] || ''}
                              onChange={(e) => handleReplyChange(activeCommentsPost.id, c._id, e.target.value)}
                              className="reply-input"
                            />
                            <button className="reply-send" onClick={() => submitReply(activeCommentsPost.id, c._id)}>
                              Send
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="no-comments">No comments yet.</p>
              )}
            </div>

            <div className="comment-composer">
              <input
                type="text"
                placeholder="Write a comment..."
                className="composer-input"
                value={modalCommentInput}
                onChange={(e) => setModalCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { submitComment(activeCommentsPost.id, modalCommentInput); setModalCommentInput(''); }
                }}
              />
              <button
                className="composer-send"
                onClick={() => { submitComment(activeCommentsPost.id, modalCommentInput); setModalCommentInput(''); }}
              >➤</button>
            </div>
          </div>
        </div>
      )}

      {showViewPostModal && viewingPost && (
        <div className="modal-overlay" onClick={() => { setShowViewPostModal(false); setViewingPost(null); }}>
          <div className="modal-content view-post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post</h2>
              <button className="close-btn" onClick={() => { setShowViewPostModal(false); setViewingPost(null); }} title="Close">✕</button>
            </div>
            <div className="view-post-content">
              <div className="post-header">
                <img
                  src={viewingPost.userAvatar}
                  alt={viewingPost.username}
                  className="post-avatar"
                  onClick={(e) => { e.stopPropagation(); handleUserClick(viewingPost.authorUserId); }}
                  style={{ cursor: 'pointer' }}
                />
                <div className="post-user-info">
                  <strong
                    className="post-username"
                    onClick={(e) => { e.stopPropagation(); handleUserClick(viewingPost.authorUserId); }}
                    style={{ cursor: 'pointer' }}
                  >{viewingPost.username}</strong>
                  <span className="post-timestamp">{viewingPost.timestamp}</span>
                </div>
              </div>
              {viewingPost.postImage && (
                <div
                  className="post-image-container"
                  onClick={(e) => { e.stopPropagation(); setViewingImage(viewingPost.postImage); setShowImageViewer(true); }}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={viewingPost.postImage} alt="post" className="post-image" />
                </div>
              )}
              <div className="post-caption">
                <p><strong>{viewingPost.username}</strong> {viewingPost.caption}</p>
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
                  onClick={() => { setActiveCommentsPost(viewingPost); setShowCommentsModal(true); setShowViewPostModal(false); }}
                >
                  <img src="/cmnt.png" alt="comment" className="action-icon" />
                </button>
                <button className="action-btn share-btn" onClick={() => { setActiveSharePost(viewingPost); setShowShareModal(true); }}>
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
            <button className="notifications-close-btn" onClick={() => setShowNotifications(false)} title="Close notifications">✕</button>
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`notification-item ${notif.isRead ? 'read' : 'unread'} ${notif.postId ? 'clickable' : ''}`}
                  onClick={() => notif.postId && handleNotificationClick(notif)}
                  style={notif.postId ? { cursor: 'pointer' } : {}}
                >
                  <img src={getProfilePic(notif.senderId?.profilePic)} alt={notif.senderId?.username || 'User'} className="notif-avatar" />
                  <div className="notif-content">
                    <p><strong>{notif.senderId?.username || 'Someone'}</strong> {notif.message}</p>
                    <span className="notif-timestamp">{formatTimestamp(notif.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="notifications-empty"><p>No notifications yet</p></div>
            )}
          </div>
        </div>
      )}

      {showCreatePostModal && (
        <div className="modal-overlay" onClick={() => setShowCreatePostModal(false)}>
          <div className="modal-content facebook-style" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create post</h2>
              <button className="close-btn" onClick={() => setShowCreatePostModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreatePost} className="facebook-post-form">
              <div className="text-input-section">
                <textarea
                  placeholder="Share your plant journey..."
                  value={newPostData.caption}
                  onChange={(e) => setNewPostData({ ...newPostData, caption: e.target.value })}
                  rows="6"
                  className="status-textarea"
                />
              </div>
              <div className="add-to-post-section">
                <p className="add-to-post-label">Add to your post</p>
                <div className="add-to-post-icons">
                  <label htmlFor="imageInput" className="post-action-icon">
                    <img src="/camera.png" alt="upload" className="action-icon-small" />
                    <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
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
                      onClick={() => setNewPostData({ ...newPostData, image: null, imagePreview: null })}
                    >✕</button>
                  </div>
                </div>
              )}
              <div className="modal-actions facebook-style">
                <button type="button" className="btn-cancel" onClick={() => setShowCreatePostModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit-facebook">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="feed-container">
          <div className="create-post-section">
            <div className="create-post-container">
              <img src={getProfilePic(currentUser?.profilePic)} alt="user" className="create-post-avatar" />
              <button className="create-post-input" onClick={() => setShowCreatePostModal(true)}>
                Share your plant journey...
              </button>
            </div>
          </div>

          <div className="posts-feed">
            {loading ? (
              <Loader size="medium" message="Loading posts..." />
            ) : postsError ? (
              <EmptyState title="Error Loading Posts" message={postsError} iconSrc="/images/no-posts-cat.png" />
            ) : posts.length === 0 ? (
              <EmptyState title="No Posts Yet" message="Be the first to share your plant journey!" iconSrc="/images/no-posts-cat.png" />
            ) : (
              posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  openPostMenuId={openPostMenuId}
                  setOpenPostMenuId={setOpenPostMenuId}
                  handleUserClick={handleUserClick}
                  setViewingImage={setViewingImage}
                  setShowImageViewer={setShowImageViewer}
                  setViewingPost={setViewingPost}
                  setShowViewPostModal={setShowViewPostModal}
                  toggleLike={toggleLike}
                  openCommentsModal={openCommentsModal}
                  setActiveSharePost={setActiveSharePost}
                  setShowShareModal={setShowShareModal}
                  handleReportClick={handleReportClick}
                  toggleReply={toggleReply}
                  openReply={openReply}
                  replyInputs={replyInputs}
                  handleReplyChange={handleReplyChange}
                  submitReply={submitReply}
                  commentInputs={commentInputs}
                  setCommentInputs={setCommentInputs}
                  submitComment={submitComment}
                  onLikesClick={openLikesModal}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className={`right-sidebar ${rightSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="right-sidebar-header">
          <button className="right-sidebar-toggle-btn" onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}>
            <img src="/trophy.png" alt="" className="trophy-icon" />
            <span className="right-sidebar-label">Leaderboard</span>
          </button>
        </div>
        <div className="right-sidebar-content">
          <LeaderBoard />
        </div>
      </div>

      {showReportModal && reportingPost && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report Post</h2>
              <button className="close-btn" onClick={() => setShowReportModal(false)}>✕</button>
            </div>
            <div className="report-modal-body">
              <p>Why are you reporting this post?</p>
              <textarea
                className="report-textarea"
                placeholder="Please provide a reason for reporting this post (minimum 10 characters)..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={5}
              />
            </div>
            <div className="report-modal-actions">
              <button className="btn-cancel" onClick={() => { setShowReportModal(false); setReportReason(''); }}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmitReport}>Submit Report</button>
            </div>
          </div>
        </div>
      )}

      {showReportSuccess && (
        <div className="modal-overlay" onClick={() => setShowReportSuccess(false)}>
          <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="success-modal-close" onClick={() => setShowReportSuccess(false)} title="Close">✕</button>
            <div className="success-modal-content">
              <div className="success-icon-container">
                <img src="/reportIcon.png" alt="report icon" className="report-icon" />
              </div>
              <h2 className="success-title">Report Submitted</h2>
              <p className="success-message">Thank you for reporting. We'll review it shortly.</p>
            </div>
          </div>
        </div>
      )}

      {showImageViewer && viewingImage && (
        <div
          className="image-viewer-overlay"
          onClick={() => { setShowImageViewer(false); setViewingImage(null); }}
        >
          <button className="image-viewer-close" onClick={() => { setShowImageViewer(false); setViewingImage(null); }} title="Close">✕</button>
          <div className="image-viewer-content" onClick={(e) => e.stopPropagation()}>
            <img src={viewingImage} alt="Full size" className="image-viewer-img" />
          </div>
        </div>
      )}

      {showShareModal && activeSharePost && (
        <div className="modal-overlay" onClick={() => { setShowShareModal(false); setActiveSharePost(null); }}>
          <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => { setShowShareModal(false); setActiveSharePost(null); }} title="Close">✕</button>
            <div className="share-modal-header">
              <img src="/postShareIcon.png" alt="share icon" className="share-icon" />
              <h2>Share Post</h2>
            </div>
            <div className="share-modal-content">
              <div className="share-preview">
                <div className="share-preview-item">
                  <strong>{activeSharePost.username}</strong>
                  <p>{activeSharePost.caption?.substring(0, 100)}...</p>
                  {activeSharePost.postImage && (
                    <img src={activeSharePost.postImage} alt="post preview" className="share-preview-image" />
                  )}
                </div>
              </div>
              <div className="share-link-section">
                <p className="share-link-label">Share Link:</p>
                <div className="share-link-box">
                  {`${window.location.origin}/post/${activeSharePost.id}`}
                </div>
              </div>
              <div className="share-buttons-container">
                <button
                  className="share-btn-primary"
                  onClick={() => {
                    const link = `${window.location.origin}/post/${activeSharePost.id}`;
                    navigator.clipboard.writeText(link);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLikesModal && (
        <div className="modal-overlay" onClick={() => { setShowLikesModal(false); setLikersData([]); }}>
          <div className="modal-content likes-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Liked by</h2>
              <button className="close-btn" onClick={() => { setShowLikesModal(false); setLikersData([]); }} title="Close">✕</button>
            </div>
            <div className="likes-list-body">
              {likersLoading ? (
                <p className="likes-list-message">Loading...</p>
              ) : likersData.length === 0 ? (
                <p className="likes-list-message">No likes yet.</p>
              ) : (
                likersData.map((user) => (
                  <div
                    key={user._id}
                    className="likes-list-item"
                    onClick={() => { handleUserClick(user._id); setShowLikesModal(false); setLikersData([]); }}
                  >
                    <img src={getProfilePic(user.profilePic)} alt={user.username} className="likes-list-avatar" />
                    <div className="likes-list-info">
                      <span className="likes-list-name">{user.name}</span>
                      <span className="likes-list-username">@{user.username}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPage;
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../Shared/Header'
import './ProfilePage.css'
import '../SocialPage/SocialPage.css'
import { getUserPosts, deletePost, updatePost } from '../../services/postService'
import { getUserMarketplacePosts } from '../../services/marketplaceService'
import { getUserJournals } from '../../services/journalService'
import { getCurrentUser } from '../../services/authService'

export default function ProfilePage({ onEdit }) {
  const [activeTab, setActiveTab] = useState('journals')
  const [journals, setJournals] = useState([])
  const [posts, setPosts] = useState([])
  const [marketplacePosts, setMarketplacePosts] = useState([])
  const [user, setUser] = useState(null)
  const [openMenuPostId, setOpenMenuPostId] = useState(null)
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [viewingImage, setViewingImage] = useState(null)
  const [showViewPostModal, setShowViewPostModal] = useState(false)
  const [viewingPost, setViewingPost] = useState(null)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [activeCommentsPost, setActiveCommentsPost] = useState(null)
  const [replyInputs, setReplyInputs] = useState({})
  const [openReply, setOpenReply] = useState({ postId: null, commentId: null })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...')
        const userData = await getCurrentUser()
        console.log('User data received:', userData)
        setUser(userData.data)
      } catch (error) {
        console.error('Error fetching user data:', error)
        console.error('Error details:', error.response?.data || error.message)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'journals') {
          const journalsData = await getUserJournals()
          setJournals(journalsData.data)
        } else if (activeTab === 'social') {
          const postsData = await getUserPosts()
          setPosts(postsData.posts)
        } else if (activeTab === 'marketplace') {
          const marketplaceData = await getUserMarketplacePosts()
          setMarketplacePosts(marketplaceData.posts)
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error)
      }
    }

    fetchData()
  }, [activeTab])

  const toggleMenu = (postId) => {
    setOpenMenuPostId((prev) => (prev === postId ? null : postId))
  }

  const formatTimestamp = (date) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffMs = now - postDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return postDate.toLocaleDateString()
  }

  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token')

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setPosts(
          posts.map((post) =>
            post._id === postId
              ? {
                ...post,
                liked: response.data.isLiked,
                likes: response.data.isLiked
                  ? [...(post.likes || []), user._id]
                  : (post.likes || []).filter(id => id !== user._id),
              }
              : post
          )
        )
      }
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  const handleViewPost = (post) => {
    setViewingPost(post)
    setShowViewPostModal(true)
  }

  const handleImageClick = (imageUrl) => {
    setViewingImage(imageUrl)
    setShowImageViewer(true)
  }

  const toggleReply = (postId, commentId) => {
    if (openReply.postId === postId && openReply.commentId === commentId) {
      setOpenReply({ postId: null, commentId: null })
    } else {
      setOpenReply({ postId, commentId })
    }
  }

  const handleReplyChange = (postId, commentId, value) => {
    setReplyInputs({ ...replyInputs, [`${postId}-${commentId}`]: value })
  }

  const submitReply = (postId, commentId) => {
    const key = `${postId}-${commentId}`
    const text = (replyInputs[key] || '').trim()
    if (!text) return

    // Update post comments with reply
    setPosts((prevPosts) => {
      const newPosts = prevPosts.map((post) => {
        if (post._id !== postId) return post
        return {
          ...post,
          comments: (post.comments || []).map((c) =>
            c.id === commentId
              ? { ...c, replies: [...(c.replies || []), { id: Date.now(), username: 'You', text }] }
              : c
          ),
        }
      })
      return newPosts
    })

    setReplyInputs({ ...replyInputs, [key]: '' })
    setOpenReply({ postId: null, commentId: null })
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await deletePost(postId)
      setPosts(posts.filter(post => post._id !== postId))
      setOpenMenuPostId(null)
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  const handleEditPost = (post) => {
    // For now, just log - you can implement edit modal later
    console.log('Edit post:', post)
    alert('Edit functionality coming soon!')
    setOpenMenuPostId(null)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'journals':
        return (
          <div className="tab-panel">
            <h2 className="journal-heading">Journals</h2>
            <div className="journal-list">
              {journals.length > 0 ? (
                journals.map((journal) => (
                  <div key={journal._id} className="journal-item">
                    <Link to={`/journal/${journal._id}`} className="journal-title">
                      {journal.title}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="journal-item">No journals found.</p>
              )}
            </div>
          </div>
        )
      case 'social':
        return (
          <div className="tab-panel">
            <h2 className="journal-heading">Posts</h2>
            <div className="posts-feed">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="post">
                    {/* Post Header */}
                    <div className="post-header">
                      <img
                        src={post.authorId?.profilePic || '/boy.png'}
                        alt={post.authorId?.name || 'User'}
                        className="avatar"
                      />
                      <div className="header-info">
                        <h3 className="username">
                          {post.authorId?.name || 'Unknown User'}
                        </h3>
                        <span className="timestamp">
                          {formatTimestamp(post.createdAt)}
                        </span>
                      </div>
                      <button
                        className="options-menu-btn"
                        onClick={() => toggleMenu(post._id)}
                      >
                        ⋮
                      </button>
                      {openMenuPostId === post._id && (
                        <div className="post-options-menu">
                          <button
                            className="menu-option"
                            onClick={() => handleEditPost(post)}
                          >
                            <img src="/settings.png" alt="edit" className="menu-icon" />
                            Edit post
                          </button>
                          <button
                            className="menu-option delete"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            <img src="/trash.png" alt="delete" className="menu-icon" />
                            Delete post
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Post Image - Only show if image exists */}
                    {post.images && post.images.length > 0 && (
                      <div
                        className="post-image-container"
                        onClick={() => handleImageClick(post.images[0])}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={post.images[0]} alt="post" className="post-image" />
                      </div>
                    )}

                    {/* Post Caption */}
                    <div
                      className="post-caption"
                      onClick={() => handleViewPost(post)}
                      style={{ cursor: 'pointer' }}
                    >
                      <p>
                        <strong>{post.authorId?.name || 'Unknown User'}</strong> {post.content}
                      </p>
                    </div>

                    <div className="post-actions">
                      <button
                        className={`action-btn like-btn ${post.likes?.includes(user?._id) ? 'liked' : ''}`}
                        onClick={() => toggleLike(post._id)}
                      >
                        <img
                          src={post.likes?.includes(user?._id) ? '/l.png' : '/leaf.png'}
                          alt="like"
                          className="action-icon"
                        />
                      </button>
                      <button
                        className="action-btn comment-btn"
                        onClick={() => {
                          setActiveCommentsPost(post)
                          setShowCommentsModal(true)
                        }}
                      >
                        <img src="/cmnt.png" alt="comment" className="action-icon" />
                      </button>
                      <button className="action-btn share-btn">
                        <img src="/send.png" alt="share" className="action-icon" />
                      </button>
                    </div>

                    <div className="likes-info">
                      <span className="likes-count">{post.likes?.length || 0} likes</span>
                    </div>

                    <div className="comments-section">
                      {post.comments && post.comments.length > 0 ? (
                        <>
                          {post.comments.slice(0, 2).map((comment) => (
                            <div key={comment.id} className="comment">
                              <div className="comment-main">
                                <strong>{comment.username}</strong> {comment.text}
                              </div>
                            </div>
                          ))}
                          {post.comments.length > 2 && (
                            <button
                              className="view-more-comments"
                              onClick={() => {
                                setActiveCommentsPost(post)
                                setShowCommentsModal(true)
                              }}
                            >
                              View all {post.comments.length} comments
                            </button>
                          )}
                        </>
                      ) : (
                        <p className="no-comments">No comments yet</p>
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
                ))
              ) : (
                <p className="journal-item">No social posts found.</p>
              )}
            </div>
          </div>
        )
      case 'marketplace':
        return (
          <div className="tab-panel">
            <h2 className="journal-heading">Marketplace</h2>
            <div className="journal-list">
              {marketplacePosts.length > 0 ? (
                marketplacePosts.map((post) => (
                  <div key={post._id} className="journal-item">
                    <h3 className="journal-title">{post.treeName}</h3>
                    <p>{post.description}</p>
                  </div>
                ))
              ) : (
                <p className="journal-item">No marketplace posts found.</p>
              )}
            </div>
          </div>
        )
      case 'leaderboard':
        return (
          <div className="tab-panel">
            <h2 className="journal-heading">Leader board</h2>
            <p className="journal-item">Leaderboard coming soon.</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-content">
        <div className="content-inner">
          <div className="profile-top">
            <div className="profile-photo" aria-hidden="false">
              <img src={user?.profilePic || "/boy.png"} alt="Profile" />
            </div>

            <div className="profile-info">
              <h2 className="username1">{user?.name || 'Loading...'}</h2>
              <button
                className="edit-btn primary"
                onClick={() => onEdit && onEdit()}
                aria-label="Edit profile"
              >
                Edit profile
              </button>
            </div>
          </div>

          <div className="profile-tabs">
            <button
              onClick={() => setActiveTab('journals')}
              className={`tab ${activeTab === 'journals' ? 'active' : ''}`}
            >
              Journals
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`tab ${activeTab === 'social' ? 'active' : ''}`}
            >
              Social
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`tab ${activeTab === 'marketplace' ? 'active' : ''}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            >
              Leader board
            </button>
          </div>
        </div>

        <div className="infos-wrapper">
          <div className="infos-box">
            <div className="content-inner">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Image Viewer */}
      {showImageViewer && viewingImage && (
        <div
          className="image-viewer-overlay"
          onClick={() => {
            setShowImageViewer(false)
            setViewingImage(null)
          }}
        >
          <button
            className="image-viewer-close"
            onClick={() => {
              setShowImageViewer(false)
              setViewingImage(null)
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

      {/* View Post Modal */}
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
                  src={viewingPost.authorId?.profilePic || '/boy.png'}
                  alt={viewingPost.authorId?.name || 'User'}
                  className="post-avatar"
                />
                <div className="post-user-info">
                  <strong className="post-username">
                    {viewingPost.authorId?.name || 'Unknown User'}
                  </strong>
                  <span className="post-timestamp">{formatTimestamp(viewingPost.createdAt)}</span>
                </div>
              </div>

              {viewingPost.images && viewingPost.images.length > 0 && (
                <div
                  className="post-image-container"
                  onClick={(e) => {
                    e.stopPropagation()
                    setViewingImage(viewingPost.images[0])
                    setShowImageViewer(true)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={viewingPost.images[0]} alt="post" className="post-image" />
                </div>
              )}

              <div className="post-caption">
                <p>
                  <strong>{viewingPost.authorId?.name || 'Unknown User'}</strong> {viewingPost.content}
                </p>
              </div>

              <div className="post-actions">
                <button
                  className={`action-btn like-btn ${viewingPost.likes?.includes(user?._id) ? 'liked' : ''}`}
                  onClick={() => toggleLike(viewingPost._id)}
                >
                  <img
                    src={viewingPost.likes?.includes(user?._id) ? '/l.png' : '/leaf.png'}
                    alt="like"
                    className="action-icon"
                  />
                </button>
                <button
                  className="action-btn comment-btn"
                  onClick={() => {
                    setActiveCommentsPost(viewingPost)
                    setShowCommentsModal(true)
                    setShowViewPostModal(false)
                  }}
                >
                  <img src="/cmnt.png" alt="comment" className="action-icon" />
                </button>
                <button className="action-btn share-btn">
                  <img src="/send.png" alt="share" className="action-icon" />
                </button>
              </div>

              <div className="likes-info">
                <span className="likes-count">{viewingPost.likes?.length || 0} likes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showCommentsModal && activeCommentsPost && (
        <div className="modal-overlay" onClick={() => setShowCommentsModal(false)}>
          <div className="modal-content comments-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Comments</h2>
              <button
                className="close-btn"
                onClick={() => setShowCommentsModal(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="comments-modal-content">
              {activeCommentsPost.comments && activeCommentsPost.comments.length > 0 ? (
                activeCommentsPost.comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-header">
                      <img src={c.userAvatar || '/boy.png'} alt={c.username} className="comment-avatar" />
                      <strong>{c.username}</strong>
                    </div>
                    <div className="comment-text">{c.text}</div>

                    {c.replies && c.replies.length > 0 && (
                      <div className="comment-replies">
                        {c.replies.map((r) => (
                          <div key={r.id} className="comment-reply">
                            <strong>{r.username}</strong> {r.text}
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      className="reply-btn"
                      onClick={() => toggleReply(activeCommentsPost._id, c.id)}
                    >
                      Reply
                    </button>

                    {openReply.postId === activeCommentsPost._id && openReply.commentId === c.id && (
                      <div className="reply-composer">
                        <input
                          type="text"
                          placeholder={`Reply to ${c.username}...`}
                          value={replyInputs[`${activeCommentsPost._id}-${c.id}`] || ''}
                          onChange={(e) => handleReplyChange(activeCommentsPost._id, c.id, e.target.value)}
                          className="reply-input"
                        />
                        <button
                          className="reply-send"
                          onClick={() => submitReply(activeCommentsPost._id, c.id)}
                        >
                          Send
                        </button>
                      </div>
                    )}
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
    </div>
  )
}

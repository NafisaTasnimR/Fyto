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
  const [challengePositions, setChallengePositions] = useState(null)
  const [leaderboardTab, setLeaderboardTab] = useState('daily')
  const [openMenuPostId, setOpenMenuPostId] = useState(null)
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [viewingImage, setViewingImage] = useState(null)
  const [showViewPostModal, setShowViewPostModal] = useState(false)
  const [viewingPost, setViewingPost] = useState(null)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [activeCommentsPost, setActiveCommentsPost] = useState(null)
  const [replyInputs, setReplyInputs] = useState({})
  const [openReply, setOpenReply] = useState({ postId: null, commentId: null })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showProfilePicModal, setShowProfilePicModal] = useState(false)
  const [openMarketplaceMenuId, setOpenMarketplaceMenuId] = useState(null)
  const [editFormData, setEditFormData] = useState({ username: '' })
  const [passwordFormData, setPasswordFormData] = useState({ previousPassword: '', newPassword: '', confirmPassword: '' })
  const [profilePicFile, setProfilePicFile] = useState(null)
  const [profilePicPreview, setProfilePicPreview] = useState(null)
  const [showPasswords, setShowPasswords] = useState({ previous: false, new: false, confirm: false })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...')
        const userData = await getCurrentUser()
        console.log('User data received:', userData)
        setUser(userData.data)
        setEditFormData({
          username: userData.data.username || '',
        })
        setPasswordFormData({
          previousPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
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
        } else if (activeTab === 'leaderboard') {
          // Mock data for frontend design - replace with API call later
          setChallengePositions({
            daily: {
              streakCount: 7,
              position: 5
            },
            monthly: {
              totalPoints: 450,
              position: 12
            },
            overall: {
              totalPoints: 2340,
              position: 45
            }
          })
          setLeaderboardTab('daily')
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

  const handleDeleteMarketplacePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this marketplace post?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/marketplace/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setMarketplacePosts(marketplacePosts.filter(post => post._id !== postId))
      setOpenMarketplaceMenuId(null)
      alert('Marketplace post deleted successfully!')
    } catch (error) {
      console.error('Error deleting marketplace post:', error)
      alert('Failed to delete marketplace post. Please try again.')
    }
  }

  const handleMarkMarketplacePostUnavailable = async (postId) => {
    if (!window.confirm('Mark this post as unavailable?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/marketplace/${postId}`,
        { status: 'unavailable' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setMarketplacePosts(
        marketplacePosts.map(post =>
          post._id === postId ? { ...post, status: 'unavailable' } : post
        )
      )
      setOpenMarketplaceMenuId(null)
      alert('Post marked as unavailable!')
    } catch (error) {
      console.error('Error marking post unavailable:', error)
      alert('Failed to update post status. Please try again.')
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
            {marketplacePosts.length > 0 ? (
              <div className="profile-marketplace-list">
                {marketplacePosts.map((post) => (
                  <div key={post._id} className="profile-marketplace-item">
                    <div className="profile-marketplace-item-image">
                      <img
                        src={post.photos && post.photos.length > 0 ? post.photos[0] : '/tree-placeholder.png'}
                        alt={post.treeName}
                      />
                    </div>
                    <div className="profile-marketplace-item-content">
                      <div className="profile-marketplace-item-header">
                        <div>
                          <h3 className="profile-marketplace-item-title">
                            {post.treeName} {post.treeType ? `- ${post.treeType}` : ''}
                          </h3>
                          <p className="profile-marketplace-item-author">{post.userId?.username || 'Anonymous'}</p>
                          <p className="profile-marketplace-item-description">{post.description}</p>
                        </div>
                        <div className="profile-marketplace-item-meta">
                          <span className="profile-marketplace-item-badge">
                            {post.postType === 'sell'
                              ? 'Buy'
                              : post.postType === 'exchange'
                              ? 'Exchange'
                              : post.postType === 'donate'
                              ? 'Donate'
                              : 'Buy'}
                          </span>
                          {post.postType === 'sell' && post.price > 0 && (
                            <span className="profile-marketplace-item-price">৳{post.price.toLocaleString()}</span>
                          )}
                          <div className="marketplace-post-menu-container">
                            <button
                              className="marketplace-post-menu-btn"
                              onClick={() =>
                                setOpenMarketplaceMenuId(
                                  openMarketplaceMenuId === post._id ? null : post._id
                                )
                              }
                            >
                              ⋮
                            </button>
                            {openMarketplaceMenuId === post._id && (
                              <div className="marketplace-post-menu-dropdown">
                                <button
                                  className="marketplace-post-menu-item"
                                  onClick={() => handleMarkMarketplacePostUnavailable(post._id)}
                                >
                                  Mark Unavailable
                                </button>
                                <button
                                  className="marketplace-post-menu-item delete"
                                  onClick={() => handleDeleteMarketplacePost(post._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="journal-item">No marketplace posts found.</p>
            )}
          </div>
        )
      case 'leaderboard':
        return (
          <div className="tab-panel">
            <h2 className="journal-heading">Leader board</h2>
            {challengePositions && (challengePositions.daily || challengePositions.monthly || challengePositions.overall) ? (
              <div className="leaderboard-section">
                <div className="leaderboard-tabs1">
                  <button
                    className={`leaderboard-tab ${leaderboardTab === 'daily' ? 'active' : ''}`}
                    onClick={() => setLeaderboardTab('daily')}
                  >
                    Daily
                  </button>
                  <button
                    className={`leaderboard-tab ${leaderboardTab === 'monthly' ? 'active' : ''}`}
                    onClick={() => setLeaderboardTab('monthly')}
                  >
                    Monthly
                  </button>
                  <button
                    className={`leaderboard-tab ${leaderboardTab === 'overall' ? 'active' : ''}`}
                    onClick={() => setLeaderboardTab('overall')}
                  >
                    Overall
                  </button>
                </div>

                <div className="leaderboard-content">
                  {leaderboardTab === 'daily' && challengePositions.daily && (
                    <div className="leaderboard-stats">
                      <div className="stat-item">
                        <p className="stat-label">Streak Count</p>
                        <p className="stat-value">{challengePositions.daily.streakCount}</p>
                        <p className="stat-unit">days</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <p className="stat-label">Your Position</p>
                        <p className="stat-value">#{challengePositions.daily.position}</p>
                        <p className="stat-unit">in leaderboard</p>
                      </div>
                    </div>
                  )}

                  {leaderboardTab === 'monthly' && challengePositions.monthly && (
                    <div className="leaderboard-stats">
                      <div className="stat-item">
                        <p className="stat-label">Total Points</p>
                        <p className="stat-value">{challengePositions.monthly.totalPoints}</p>
                        <p className="stat-unit">points</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <p className="stat-label">Your Position</p>
                        <p className="stat-value">#{challengePositions.monthly.position}</p>
                        <p className="stat-unit">in leaderboard</p>
                      </div>
                    </div>
                  )}

                  {leaderboardTab === 'overall' && challengePositions.overall && (
                    <div className="leaderboard-stats">
                      <div className="stat-item">
                        <p className="stat-label">Total Points</p>
                        <p className="stat-value">{challengePositions.overall.totalPoints}</p>
                        <p className="stat-unit">points</p>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="stat-item">
                        <p className="stat-label">Your Position</p>
                        <p className="stat-value">#{challengePositions.overall.position}</p>
                        <p className="stat-unit">in leaderboard</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-participation">
                <img src="/alert.png" alt="Alert" className="no-participation-icon" />
                <p className="no-participation-text">You haven't participated in any challenges</p>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: '', text: '' }

    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSymbol = /[^a-zA-Z0-9]/.test(password)

    const criteria = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length

    if (password.length < 4) return { strength: 'weak', text: 'Password strength is Weak' }
    if (criteria <= 2 || password.length < 8) return { strength: 'weak', text: 'Password strength is Weak' }
    if (criteria === 3) return { strength: 'medium', text: 'Password strength is Medium' }
    return { strength: 'strong', text: 'Password strength is Strong' }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/update`,
        {
          username: editFormData.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          username: editFormData.username,
        }))
        setShowEditModal(false)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleSavePassword = async () => {
    try {
      // Validation
      if (!passwordFormData.previousPassword) {
        alert('Please enter your current password')
        return
      }

      if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
        alert('New password and confirm password do not match')
        return
      }

      if (passwordFormData.newPassword.length < 6) {
        alert('New password must be at least 6 characters long')
        return
      }

      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/update`,
        {
          previousPassword: passwordFormData.previousPassword,
          newPassword: passwordFormData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setShowPasswordModal(false)
        setPasswordFormData({ previousPassword: '', newPassword: '', confirmPassword: '' })
        alert('Password updated successfully!')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Error updating password: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePicFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfilePic = async () => {
    try {
      if (!profilePicFile) {
        alert('Please select a picture')
        return
      }

      const formData = new FormData()
      formData.append('profilePic', profilePicFile)

      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/upload-profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          profilePic: response.data.profilePicUrl,
        }))
        setShowProfilePicModal(false)
        setProfilePicFile(null)
        setProfilePicPreview(null)
        alert('Profile picture updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile picture:', error)
      alert('Error updating profile picture: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleCancelProfilePic = () => {
    setShowProfilePicModal(false)
    setProfilePicFile(null)
    setProfilePicPreview(null)
  }

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-content">
        <div className="content-inner">
          <div className="profile-top">
            <div className="profile-photo" aria-hidden="false">
              <img src={user?.profilePic || "/boy.png"} alt="Profile" />
              <button
                className="camera-btn"
                onClick={() => setShowProfilePicModal(true)}
                aria-label="Change profile picture"
              >
                <img src="/camera.png" alt="Camera" />
              </button>
            </div>

            <div className="profile-info">
              <div>
                <h2 className="username1">{user?.username || 'Loading...'}</h2>
                <p className="user-details">
                  <span>{user?.name}</span>
                </p>
                <p className="user-details">
                  <span>{user?.email}</span>
                </p>
              </div>
              <div className="profile-actions">
                <div className="profile-points-section">
                  <img src="/reward.png" alt="Reward" className="points-icon1" />
                  <div className="points-info">
      
                    <p className="points-value1">{user?.points || 0}</p>
                  </div>
                </div>
                <button
                  className="edit-btn primary"
                  onClick={() => setShowEditModal(true)}
                  aria-label="Edit profile"
                >
                  Edit profile
                </button>
              </div>
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

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="form-input disabled"
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditFormChange}
                  className="form-input"
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="form-input disabled"
                />
              </div>

              <div className="form-group">
                <div className="password-field-header">
                  <label>Password</label>
                </div>
                <div className="password-display">
                  <span>••••••••</span>
                  <button
                    type="button"
                    className="edit-password-btn"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowPasswordModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group password-group">
                <label>Current Password</label>
                <input
                  type={showPasswords.previous ? 'text' : 'password'}
                  name="previousPassword"
                  value={passwordFormData.previousPassword}
                  onChange={handlePasswordFormChange}
                  className="form-input"
                  placeholder="Enter current password"
                />
                <span
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('previous')}
                >
                  <img
                    src={showPasswords.previous ? '/view.png' : '/eyebrow.png'}
                    alt="toggle password visibility"
                  />
                </span>
              </div>

              <div className="form-group password-group">
                <label>New Password</label>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordFormChange}
                  className="form-input"
                  placeholder="Enter new password"
                />
                <span
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  <img
                    src={showPasswords.new ? '/view.png' : '/eyebrow.png'}
                    alt="toggle password visibility"
                  />
                </span>
              </div>
              {passwordFormData.newPassword && (
                <>
                  <div className="password-criteria">
                    <span className={passwordFormData.newPassword && /[a-z]/.test(passwordFormData.newPassword) ? 'active' : ''}>Lower</span>
                    <span className={passwordFormData.newPassword && /[A-Z]/.test(passwordFormData.newPassword) ? 'active' : ''}>Upper</span>
                    <span className={passwordFormData.newPassword && /[0-9]/.test(passwordFormData.newPassword) ? 'active' : ''}>Number</span>
                    <span className={passwordFormData.newPassword && /[^a-zA-Z0-9]/.test(passwordFormData.newPassword) ? 'active' : ''}>Symbol</span>
                  </div>
                  <div className={`password-strength ${getPasswordStrength(passwordFormData.newPassword).strength}`}>
                    {getPasswordStrength(passwordFormData.newPassword).text}
                  </div>
                </>
              )}

              <div className="form-group password-group">
                <label>Confirm Password</label>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordFormData.confirmPassword}
                  onChange={handlePasswordFormChange}
                  className="form-input"
                  placeholder="Confirm new password"
                />
                <span
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  <img
                    src={showPasswords.confirm ? '/view.png' : '/eyebrow.png'}
                    alt="toggle password visibility"
                  />
                </span>
              </div>
              {passwordFormData.confirmPassword && passwordFormData.newPassword !== passwordFormData.confirmPassword && (
                <p className="password-mismatch">Passwords do not match</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowPasswordModal(false)}
              >
                Back
              </button>
              <button
                className="btn-save"
                onClick={handleSavePassword}
              >
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfilePicModal && (
        <div className="modal-overlay" onClick={() => handleCancelProfilePic()}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Profile Picture</h2>
              <button
                className="modal-close-btn"
                onClick={() => handleCancelProfilePic()}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="profile-pic-upload-container">
                <div className="profile-pic-preview">
                  <img
                    src={profilePicPreview || user?.profilePic || "/boy.png"}
                    alt="Profile Preview"
                    className="preview-image"
                  />
                </div>

                <label className="file-input-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="file-input"
                  />
                  <span className="file-input-btn">Choose Photo</span>
                </label>

                {profilePicFile && (
                  <p className="file-name">
                    Selected: {profilePicFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => handleCancelProfilePic()}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSaveProfilePic}
                disabled={!profilePicFile}
              >
                Save Picture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

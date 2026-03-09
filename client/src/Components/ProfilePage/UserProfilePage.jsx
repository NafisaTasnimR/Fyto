import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../Shared/Header'
import Loader from '../Shared/Loader'
import { getProfilePic } from '../../utils/imageUtils'
import './ProfilePage.css'
import '../SocialPage/SocialPage.css'

export default function UserProfilePage() {
  const { userId } = useParams()
  const [activeTab, setActiveTab] = useState('journals')
  const [user, setUser] = useState(null)
  const [journals, setJournals] = useState([])
  const [posts, setPosts] = useState([])
  const [marketplacePosts, setMarketplacePosts] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showImageViewer, setShowImageViewer] = useState(false)
  const [viewingImage, setViewingImage] = useState(null)
  const [showViewPostModal, setShowViewPostModal] = useState(false)
  const [viewingPost, setViewingPost] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [activeSharePost, setActiveSharePost] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        const profileRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}/profile`,
          { headers }
        )
        if (!profileRes.data.success) {
          setError('User not found')
          return
        }
        const { user: profileUser, posts: userPosts, journals: userJournals } = profileRes.data.data
        setUser(profileUser)
        setTotalPoints(profileUser.scores?.totalScore || 0)
        setPosts(userPosts || [])
        setJournals(userJournals || [])

        try {
          const mpRes = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/marketplace?limit=100`,
            { headers }
          )
          const allMp = mpRes.data.posts || []
          setMarketplacePosts(allMp.filter(p =>
            (p.userId?._id?.toString() || p.userId?.toString()) === userId
          ))
        } catch {
          setMarketplacePosts([])
        }
      } catch (err) {
        setError('Failed to load profile')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [userId])

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
                    <span className="journal-title">{journal.title}</span>
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
                    <div className="post-header">
                      <img
                        src={getProfilePic(post.authorId?.profilePic || user?.profilePic)}
                        alt={post.authorId?.username || user?.username || 'User'}
                        className="avatar"
                      />
                      <div className="header-info">
                        <h3 className="username">{post.authorId?.username || post.authorId?.name || user?.username || 'Anonymous'}</h3>
                        <span className="timestamp">{formatTimestamp(post.createdAt)}</span>
                      </div>
                    </div>

                    {post.images && post.images.length > 0 && (
                      <div
                        className="post-image-container"
                        onClick={() => { setViewingImage(post.images[0]); setShowImageViewer(true) }}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={post.images[0]} alt="post" className="post-image" />
                      </div>
                    )}

                    <div
                      className="post-caption"
                      onClick={() => { setViewingPost(post); setShowViewPostModal(true) }}
                      style={{ cursor: 'pointer' }}
                    >
                      <p><strong>{post.authorId?.username || post.authorId?.name || user?.username || 'Anonymous'}</strong> {post.content}</p>
                    </div>

                    <div className="post-actions">
                      <button className="action-btn like-btn">
                        <img src="/leaf.png" alt="like" className="action-icon" />
                      </button>
                      <button className="action-btn comment-btn">
                        <img src="/cmnt.png" alt="comment" className="action-icon" />
                      </button>
                      {post.visibility !== 'private' && (
                        <button
                          className="action-btn share-btn"
                          onClick={() => { setActiveSharePost(post); setShowShareModal(true) }}
                        >
                          <img src="/send.png" alt="share" className="action-icon" />
                        </button>
                      )}
                    </div>

                    <div className="likes-info">
                      <span className="likes-count">{post.likes?.length || 0} likes</span>
                    </div>

                    <div className="comments-section">
                      {post.comments && post.comments.length > 0 ? (
                        <p className="no-comments">{post.comments.length} comment{post.comments.length > 1 ? 's' : ''}</p>
                      ) : (
                        <p className="no-comments">No comments yet</p>
                      )}
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
                            {post.treeName}{post.treeType ? ` - ${post.treeType}` : ''}
                          </h3>
                          <p className="profile-marketplace-item-author">
                            {post.userId?.username || user?.username || 'Anonymous'}
                          </p>
                          <p className="profile-marketplace-item-description">{post.description}</p>
                        </div>
                        <div className="profile-marketplace-item-meta">
                          <span className="profile-marketplace-item-badge">
                            {post.postType === 'sell' ? 'Buy'
                              : post.postType === 'exchange' ? 'Exchange'
                              : post.postType === 'donate' ? 'Donate'
                              : 'Buy'}
                          </span>
                          {post.postType === 'sell' && post.price > 0 && (
                            <span className="profile-marketplace-item-price">
                              ৳{post.price.toLocaleString()}
                            </span>
                          )}
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

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-content">
          <div className="content-inner">
            <Loader size="medium" message="Loading profile..." />
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-content">
          <div className="content-inner" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            <p>{error || 'User not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-content">
        <div className="content-inner">
          <div className="profile-top">
            {/* Profile photo — read-only, no camera button */}
            <div className="profile-photo" aria-hidden="false">
              <img src={getProfilePic(user?.profilePic)} alt="Profile" />
            </div>

            <div className="profile-info">
              <div>
                <h2 className="username1">{user?.username}</h2>
                <p className="user-details"><span>{user?.name}</span></p>
                <p className="user-details"><span>{user?.email}</span></p>
              </div>
              <div className="profile-actions">
                <div className="profile-points-section">
                  <img src="/star.png" alt="Reward" className="points-icon1" />
                  <div className="points-info">
                    <p className="points-value1">{totalPoints}</p>
                  </div>
                </div>
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

      {/* Share Modal */}
      {showShareModal && activeSharePost && (
        <div className="modal-overlay" onClick={() => { setShowShareModal(false); setActiveSharePost(null) }}>
          <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => { setShowShareModal(false); setActiveSharePost(null) }} title="Close">✕</button>
            <div className="share-modal-header">
              <img src="/postShareIcon.png" alt="share icon" className="share-icon" />
              <h2>Share Post</h2>
            </div>
            <div className="share-modal-content">
              <div className="share-preview">
                <div className="share-preview-item">
                  <strong>{activeSharePost.authorId?.username || user?.username || 'Anonymous'}</strong>
                  <p>{(activeSharePost.content || '').substring(0, 100)}{activeSharePost.content?.length > 100 ? '...' : ''}</p>
                  {activeSharePost.images && activeSharePost.images.length > 0 && (
                    <img src={activeSharePost.images[0]} alt="post preview" className="share-preview-image" />
                  )}
                </div>
              </div>
              <div className="share-link-section">
                <p className="share-link-label">Share Link:</p>
                <div className="share-link-box">
                  {`${window.location.origin}/post/${activeSharePost._id}`}
                </div>
              </div>
              <div className="share-buttons-container">
                <button
                  className="share-btn-primary"
                  onClick={() => {
                    const link = `${window.location.origin}/post/${activeSharePost._id}`
                    navigator.clipboard.writeText(link)
                    alert('Link copied to clipboard!')
                  }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Image Viewer */}
      {showImageViewer && viewingImage && (
        <div
          className="image-viewer-overlay"
          onClick={() => { setShowImageViewer(false); setViewingImage(null) }}
        >
          <button
            className="image-viewer-close"
            onClick={() => { setShowImageViewer(false); setViewingImage(null) }}
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
        <div
          className="modal-overlay"
          onClick={() => { setShowViewPostModal(false); setViewingPost(null) }}
        >
          <div className="modal-content view-post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post</h2>
              <button
                className="close-btn"
                onClick={() => { setShowViewPostModal(false); setViewingPost(null) }}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="view-post-content">
              <div className="post-header">
                <img
                  src={getProfilePic(viewingPost.authorId?.profilePic || user?.profilePic)}
                  alt={viewingPost.authorId?.username || user?.username || 'User'}
                  className="post-avatar"
                />
                <div className="post-user-info">
                  <strong className="post-username">{viewingPost.authorId?.username || viewingPost.authorId?.name || user?.username || 'Anonymous'}</strong>
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
                <p><strong>{viewingPost.authorId?.username || viewingPost.authorId?.name || user?.username || 'Anonymous'}</strong> {viewingPost.content}</p>
              </div>

              <div className="likes-info">
                <span className="likes-count">{viewingPost.likes?.length || 0} likes</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
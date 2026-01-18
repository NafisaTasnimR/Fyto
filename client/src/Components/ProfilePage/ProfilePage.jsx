import React, { useState } from 'react'
import Header from '../Shared/Header'
import './ProfilePage.css'
import '../SocialPage/SocialPage.css'

export default function ProfilePage({ user = null, onEdit }) {
  const [activeTab, setActiveTab] = useState('Journals')

  const tabs = ['Journals', 'Social', 'Marketplace', 'Leader board']

  const userPosts = [
    {
      id: 1,
      username: (user && user.name) || 'Sohel Rahman',
      userAvatar: '/boy.png',
      postImage: '/g1.jpg',
      likes: 12,
      caption: 'A small update from my garden today. Loving the new growth!',
      timestamp: '2 hours ago',
      liked: false,
      comments: [],
    },
    {
      id: 2,
      username: (user && user.name) || 'Sohel Rahman',
      userAvatar: '/boy.png',
      postImage: null,
      likes: 5,
      caption: 'Planted a new herb pot — basil and mint.',
      timestamp: '1 day ago',
      liked: false,
      comments: [],
    },
  ]
  const [openMenuPostId, setOpenMenuPostId] = useState(null)

  const toggleMenu = (postId) => {
    setOpenMenuPostId((prev) => (prev === postId ? null : postId))
  }

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-content">
        <div className="content-inner">
          <div className="profile-top">
            <div className="profile-photo" aria-hidden="false">
              <img src="/boy.png" alt="Profile" />
            </div>

            <div className="profile-info">
              <h2 className="username1">{(user && user.name) || 'Sohel Rahman'}</h2>
              <button
                className="edit-btn primary"
                onClick={() => onEdit && onEdit()}
                aria-label="Edit profile"
              >
                Edit profile
              </button>
            </div>
          </div>

          <nav className="profile-tabs" role="tablist" aria-label="Profile tabs">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={activeTab === t}
                className={`tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>

        <div className="infos-wrapper">
          <div className="infos-box">
            <div className="content-inner">
              <section className="tab-panel">
                {activeTab === 'Journals' ? (
                  <>
                    <h3 className="journal-heading">Journals</h3>
                    <div className="journal-list">
                      {['Journal1', 'Journal2', 'Journal3', 'Journal4', 'Journal5'].map((name) => (
                        <div key={name} className="journal-item">
                          <div className="journal-title">{name}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : activeTab === 'Social' ? (
                  <>
                    <h3 className="journal-heading">Posts</h3>
                    <div className="feed-container">
                      <div className="posts-feed">
                    {userPosts.map((post) => (
                      <div key={post.id} className="post">
                        <div className="post-header">
                          <img src={post.userAvatar} alt={post.username} className="avatar" />
                          <div className="header-info">
                            <h3 className="username">{post.username}</h3>
                            <span className="timestamp">{post.timestamp}</span>
                          </div>

                          <button
                            className="post-menu-btn"
                            onClick={() => toggleMenu(post.id)}
                            aria-label="Open post menu"
                          >
                            &#8942;
                          </button>

                          {openMenuPostId === post.id && (
                            <div className="post-menu" role="menu">
                              <button className="post-menu-item" role="menuitem">
                                <img src="/settings.png" alt="settings" />
                                <div className="menu-text">Edit post</div>
                              </button>
                              <div className="post-menu-sep" />
                              <button className="post-menu-item danger" role="menuitem">
                                <img src="/trash.png" alt="delete" />
                                <div className="menu-text">Delete post</div>
                              </button>
                            </div>
                          )}
                        </div>

                        {post.postImage && (
                          <div className="post-image-container">
                            <img src={post.postImage} alt="post" className="post-image" />
                          </div>
                        )}

                        <div className="post-caption">
                          <p>
                            <strong>{post.username}</strong> {post.caption}
                          </p>
                        </div>

                        <div className="post-actions">
                          <button className={`action-btn like-btn ${post.liked ? 'liked' : ''}`}>
                            <img src={post.liked ? '/l.png' : '/leaf.png'} alt="like" className="action-icon" />
                          </button>
                          <button className="action-btn comment-btn">
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
                            post.comments.map((c) => (
                              <div key={c.id} className="comment">
                                <strong>{c.username}</strong> {c.text}
                              </div>
                            ))
                          ) : (
                            <p className="no-comments">No comments yet.</p>
                          )}
                        </div>

                        <div className="add-comment">
                          <input type="text" placeholder="Add a comment..." className="comment-input" />
                          <button className="post-comment-btn">Post</button>
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                  </>
                ) : (
                  <p>{activeTab} content goes here.</p>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

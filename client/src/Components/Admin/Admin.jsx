import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

/* ── Decode JWT to get admin email ── */
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

/* ── Dummy reported posts (replace with API later) ── */
const MOCK_SOCIAL_REPORTS = [
  {
    _id: 'sr1',
    postId: 'p1',
    postType: 'social',
    reason: 'Inappropriate content – contains offensive language.',
    reportedBy: { username: 'GreenThumb42', email: 'green42@mail.com' },
    createdAt: '2026-02-27T14:30:00Z',
    post: {
      _id: 'p1',
      authorId: { username: 'PlantLover99', profilePicture: '' },
      content: 'Check out my new rare succulent collection! 🌵🪴',
      images: ['/g1.jpg'],
      createdAt: '2026-02-25T10:15:00Z',
    },
  },
  {
    _id: 'sr2',
    postId: 'p2',
    postType: 'social',
    reason: 'Spam / promotional post not related to plants.',
    reportedBy: { username: 'LeafyLena', email: 'lena@mail.com' },
    createdAt: '2026-02-28T09:12:00Z',
    post: {
      _id: 'p2',
      authorId: { username: 'SpamBot123', profilePicture: '' },
      content: 'Buy cheap electronics at mystore.xyz!!!',
      images: [],
      createdAt: '2026-02-27T22:00:00Z',
    },
  },
  {
    _id: 'sr3',
    postId: 'p3',
    postType: 'social',
    reason: 'Misinformation – dangerous plant care advice that could harm pets.',
    reportedBy: { username: 'PetSafePlants', email: 'petsafe@mail.com' },
    createdAt: '2026-03-01T07:45:00Z',
    post: {
      _id: 'p3',
      authorId: { username: 'GardenGuru', profilePicture: '' },
      content:
        'Oleander leaves make a great herbal tea – totally safe for everyone including cats and dogs! 🍵',
      images: [],
      createdAt: '2026-02-28T18:30:00Z',
    },
  },
];

const MOCK_MARKETPLACE_REPORTS = [
  {
    _id: 'mr1',
    postId: 'm1',
    postType: 'marketplace',
    reason: 'Selling prohibited / invasive plant species.',
    reportedBy: { username: 'EcoWatch', email: 'eco@mail.com' },
    createdAt: '2026-02-26T16:20:00Z',
    post: {
      _id: 'm1',
      userId: { username: 'PlantDealer', profilePicture: '' },
      treeName: 'Japanese Knotweed',
      treeType: 'Invasive',
      offering: 'Fresh cuttings ready to plant',
      description: 'Fast‑growing ground cover – spreads quickly!',
      postType: 'sell',
      price: 15,
      photos: ['/g2.jpg'],
      createdAt: '2026-02-24T12:00:00Z',
    },
  },
  {
    _id: 'mr2',
    postId: 'm2',
    postType: 'marketplace',
    reason: 'Fraudulent listing – price is unrealistic for this species.',
    reportedBy: { username: 'PlantPolice', email: 'police@mail.com' },
    createdAt: '2026-02-28T11:50:00Z',
    post: {
      _id: 'm2',
      userId: { username: 'ShadyDeals', profilePicture: '' },
      treeName: 'Monstera Albo Variegata',
      treeType: 'Tropical',
      offering: 'Full plant with 5 leaves',
      description: 'Rare variegated Monstera at a steal!',
      postType: 'sell',
      price: 5,
      photos: ['/g3.jpg'],
      createdAt: '2026-02-27T08:30:00Z',
    },
  },
];

const Admin = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [socialReports, setSocialReports] = useState([]);
  const [marketplaceReports, setMarketplaceReports] = useState([]);
  const [activeTab, setActiveTab] = useState('social');
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  /* ── Bootstrap ── */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    const decoded = decodeToken(token);
    if (decoded?.email) setAdminEmail(decoded.email);

    // TODO: replace with real API calls
    // fetchReports(token);
    setSocialReports(MOCK_SOCIAL_REPORTS);
    setMarketplaceReports(MOCK_MARKETPLACE_REPORTS);
  }, [navigate]);

  /* ── Helpers ── */
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /* ── Actions ── */
  const openConfirm = (type, report) =>
    setConfirmModal({ type, report });

  const closeConfirm = () => setConfirmModal(null);

  const handleDeletePost = async (report) => {
    setActionLoading(report._id);
    try {
      const token = localStorage.getItem('token');
      const endpoint =
        report.postType === 'social'
          ? `${process.env.REACT_APP_API_URL}/api/posts/${report.postId}`
          : `${process.env.REACT_APP_API_URL}/api/marketplace/${report.postId}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from local state
      if (report.postType === 'social') {
        setSocialReports((prev) => prev.filter((r) => r._id !== report._id));
      } else {
        setMarketplaceReports((prev) =>
          prev.filter((r) => r._id !== report._id)
        );
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setActionLoading(null);
      closeConfirm();
    }
  };

  const handleDismissReport = async (report) => {
    setActionLoading(report._id);
    try {
      // TODO: call dismiss‑report API
      // const token = localStorage.getItem('token');
      // await axios.patch(
      //   `${process.env.REACT_APP_API_URL}/api/reports/${report._id}/dismiss`,
      //   {},
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      if (report.postType === 'social') {
        setSocialReports((prev) => prev.filter((r) => r._id !== report._id));
      } else {
        setMarketplaceReports((prev) =>
          prev.filter((r) => r._id !== report._id)
        );
      }
    } catch (err) {
      console.error('Dismiss failed:', err);
      alert('Failed to dismiss report.');
    } finally {
      setActionLoading(null);
      closeConfirm();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  /* ── Counts ── */
  const totalReports = socialReports.length + marketplaceReports.length;
  const currentReports =
    activeTab === 'social' ? socialReports : marketplaceReports;

  /* ── Render ── */
  return (
    <div className="admin-dashboard">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-logo">
            <img src="/2.png" alt="Fyto" className="admin-logo-icon" />
            <span className="admin-logo-text">Fyto Admin</span>
          </div>

          <nav className="admin-nav">
            <button
              className={`admin-nav-btn ${
                activeTab === 'social' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('social')}
            >
              <span className="admin-nav-icon">📝</span>
              Social Posts
              {socialReports.length > 0 && (
                <span className="admin-badge">{socialReports.length}</span>
              )}
            </button>

            <button
              className={`admin-nav-btn ${
                activeTab === 'marketplace' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('marketplace')}
            >
              <span className="admin-nav-icon">🛒</span>
              Marketplace
              {marketplaceReports.length > 0 && (
                <span className="admin-badge">
                  {marketplaceReports.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile-card">
            <div className="admin-avatar">
              {adminEmail ? adminEmail.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-profile-info">
              <span className="admin-role">Administrator</span>
              <span className="admin-email" title={adminEmail}>
                {adminEmail || 'admin@fyto.com'}
              </span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Reported Posts</h1>
            <p className="admin-subtitle">
              {totalReports} report{totalReports !== 1 && 's'} pending review
            </p>
          </div>
        </header>

        {/* Tab pills (mobile) */}
        <div className="admin-tabs-mobile">
          <button
            className={`admin-tab-pill ${
              activeTab === 'social' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('social')}
          >
            Social ({socialReports.length})
          </button>
          <button
            className={`admin-tab-pill ${
              activeTab === 'marketplace' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('marketplace')}
          >
            Marketplace ({marketplaceReports.length})
          </button>
        </div>

        {/* Reports grid */}
        {currentReports.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">✅</span>
            <h3>All clear!</h3>
            <p>No reported {activeTab} posts to review.</p>
          </div>
        ) : (
          <div className="admin-reports-grid">
            {currentReports.map((report) => (
              <div className="admin-report-card" key={report._id}>
                {/* Report badge */}
                <div className="admin-report-badge">
                  <span className="admin-report-flag">⚠️</span>
                  <span>Reported {formatDate(report.createdAt)}</span>
                </div>

                {/* Post preview */}
                <div className="admin-post-preview">
                  {report.postType === 'social' ? (
                    /* Social post */
                    <>
                      <div className="admin-post-author">
                        <div className="admin-author-avatar">
                          {report.post.authorId?.profilePicture ? (
                            <img
                              src={report.post.authorId.profilePicture}
                              alt=""
                            />
                          ) : (
                            <span>
                              {report.post.authorId?.username
                                ?.charAt(0)
                                .toUpperCase() || '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="admin-author-name">
                            {report.post.authorId?.username || 'Unknown'}
                          </p>
                          <p className="admin-post-date">
                            {formatDate(report.post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="admin-post-content">
                        {report.post.content}
                      </p>
                      {report.post.images?.length > 0 && (
                        <div className="admin-post-images">
                          {report.post.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="post"
                              className="admin-post-img"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Marketplace post */
                    <>
                      <div className="admin-post-author">
                        <div className="admin-author-avatar">
                          {report.post.userId?.profilePicture ? (
                            <img
                              src={report.post.userId.profilePicture}
                              alt=""
                            />
                          ) : (
                            <span>
                              {report.post.userId?.username
                                ?.charAt(0)
                                .toUpperCase() || '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="admin-author-name">
                            {report.post.userId?.username || 'Unknown'}
                          </p>
                          <p className="admin-post-date">
                            {formatDate(report.post.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="admin-marketplace-info">
                        <h4 className="admin-tree-name">
                          {report.post.treeName}
                        </h4>
                        <div className="admin-marketplace-tags">
                          <span className="admin-tag admin-tag-type">
                            {report.post.treeType}
                          </span>
                          <span
                            className={`admin-tag admin-tag-${report.post.postType}`}
                          >
                            {report.post.postType}
                          </span>
                          {report.post.price > 0 && (
                            <span className="admin-tag admin-tag-price">
                              ${report.post.price}
                            </span>
                          )}
                        </div>
                        <p className="admin-post-content">
                          {report.post.description}
                        </p>
                      </div>

                      {report.post.photos?.length > 0 && (
                        <div className="admin-post-images">
                          {report.post.photos.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="listing"
                              className="admin-post-img"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Report reason */}
                <div className="admin-report-reason">
                  <p className="admin-reason-label">Reason for report</p>
                  <p className="admin-reason-text">{report.reason}</p>
                  <p className="admin-reporter">
                    Reported by&nbsp;
                    <strong>{report.reportedBy?.username || 'Anonymous'}</strong>
                  </p>
                </div>

                {/* Actions */}
                <div className="admin-report-actions">
                  <button
                    className="admin-action-btn admin-dismiss-btn"
                    disabled={actionLoading === report._id}
                    onClick={() => openConfirm('dismiss', report)}
                  >
                    {actionLoading === report._id ? 'Processing…' : 'Dismiss'}
                  </button>
                  <button
                    className="admin-action-btn admin-delete-btn"
                    disabled={actionLoading === report._id}
                    onClick={() => openConfirm('delete', report)}
                  >
                    {actionLoading === report._id ? 'Processing…' : 'Delete Post'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Confirmation modal ── */}
      {confirmModal && (
        <div className="admin-modal-overlay" onClick={closeConfirm}>
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal-title">
              {confirmModal.type === 'delete'
                ? 'Delete this post?'
                : 'Dismiss this report?'}
            </h3>
            <p className="admin-modal-text">
              {confirmModal.type === 'delete'
                ? 'The post will be permanently removed and the author will be notified. This action cannot be undone.'
                : 'The report will be cleared and the post will remain visible. Are you sure?'}
            </p>
            <div className="admin-modal-actions">
              <button
                className="admin-action-btn admin-cancel-modal-btn"
                onClick={closeConfirm}
              >
                Cancel
              </button>
              <button
                className={`admin-action-btn ${
                  confirmModal.type === 'delete'
                    ? 'admin-delete-btn'
                    : 'admin-dismiss-btn'
                }`}
                onClick={() =>
                  confirmModal.type === 'delete'
                    ? handleDeletePost(confirmModal.report)
                    : handleDismissReport(confirmModal.report)
                }
              >
                {confirmModal.type === 'delete' ? 'Yes, Delete' : 'Yes, Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

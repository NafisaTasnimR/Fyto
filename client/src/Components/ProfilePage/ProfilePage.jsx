import React, { useState } from 'react'
import Header from '../Shared/Header'
import './ProfilePage.css'

export default function ProfilePage({ user = null, onEdit }) {
  const [activeTab, setActiveTab] = useState('Journal')

  const tabs = ['Journal', 'Social', 'Marketplace', 'Leader board']

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
                <p>{activeTab} content goes here.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

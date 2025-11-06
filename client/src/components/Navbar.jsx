import React, { useState } from 'react';
import './Navbar.css';

function Navbar({ isLoggedIn, user, onLogout, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => onNavigate('home')}>
          <span className="logo">🏋️</span>
          <span className="brand-name">FitZone Gym</span>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {!isLoggedIn ? (
            <>
              <button onClick={() => onNavigate('home')} className="nav-link">
                🏠 Home
              </button>
              <button onClick={() => onNavigate('about')} className="nav-link">
                ℹ️ About
              </button>
              <button onClick={() => onNavigate('pricing')} className="nav-link">
                💰 Pricing
              </button>
              <button onClick={() => onNavigate('contact')} className="nav-link">
                📞 Contact
              </button>
              <button onClick={() => onNavigate('login')} className="nav-btn-primary">
                🔐 Login
              </button>
              <button onClick={() => onNavigate('register')} className="nav-btn-secondary">
                📝 Sign Up
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('dashboard')} className="nav-link">
                📊 Dashboard
              </button>
              {user?.role === 'admin' && (
                <>
                  <button onClick={() => onNavigate('members')} className="nav-link">
                    👥 Members
                  </button>
                  <button onClick={() => onNavigate('classes')} className="nav-link">
                    🎯 Classes
                  </button>
                  <button onClick={() => onNavigate('reports')} className="nav-link">
                    📈 Reports
                  </button>
                </>
              )}
              {user?.role === 'user' && (
                <>
                  <button onClick={() => onNavigate('my-profile')} className="nav-link">
                    👤 My Profile
                  </button>
                  <button onClick={() => onNavigate('my-classes')} className="nav-link">
                    🎯 My Classes
                  </button>
                  <button onClick={() => onNavigate('attendance')} className="nav-link">
                    ✅ Attendance
                  </button>
                </>
              )}
              <div className="user-menu">
                <span className="user-name">👋 {user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={onLogout} className="nav-btn-logout">
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
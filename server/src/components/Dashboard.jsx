import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view dashboard');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend not responding. Is server running?');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load stats');
      }

      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={fetchStats}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-hero">
        <div className="hero-icon">📊</div>
        <div className="hero-text">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with your gym today.</p>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card purple">
          <div className="stat-header">
            <div className="stat-icon">👥</div>
            <span className="stat-label">TOTAL MEMBERS</span>
          </div>
          <div className="stat-body">
            <h2 className="stat-number">{stats.totalMembers}</h2>
            <span className="stat-change positive">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card pink">
          <div className="stat-header">
            <div className="stat-icon">💰</div>
            <span className="stat-label">TOTAL REVENUE</span>
          </div>
          <div className="stat-body">
            <h2 className="stat-number">₹{stats.revenue?.toLocaleString()}</h2>
            <span className="stat-change positive">+8% from last month</span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-header">
            <div className="stat-icon">🎯</div>
            <span className="stat-label">ACTIVE CLASSES</span>
          </div>
          <div className="stat-body">
            <h2 className="stat-number">5</h2>
            <span className="stat-change">Running today</span>
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h2>⚡ Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <span className="action-text">Add Member</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">👨‍🏫</span>
            <span className="action-text">Add Trainer</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📅</span>
            <span className="action-text">Schedule Class</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span className="action-text">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
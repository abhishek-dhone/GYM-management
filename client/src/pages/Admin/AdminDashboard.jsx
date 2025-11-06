// pages/Admin/AdminDashboard.jsx - WITH REAL-TIME DATA
import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalTrainers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    pendingAmount: 0,
    todayAttendance: 0
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch all data in parallel
      const [membersRes, trainersRes, paymentsRes, attendanceRes, classesRes] = await Promise.all([
        fetch('/api/members/stats', { headers }),
        fetch('/api/trainers', { headers }),
        fetch('/api/payments', { headers }),
        fetch('/api/attendance/today', { headers }),
        fetch('/api/classes', { headers })
      ]);

      const membersData = await membersRes.json();
      const trainersData = await trainersRes.json();
      const paymentsData = await paymentsRes.json();
      const attendanceData = await attendanceRes.json();
      const classesData = await classesRes.json();

      // Calculate revenue and pending payments
      const payments = paymentsData.payments || [];
      const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const pendingPayments = payments.filter(p => p.status === 'pending');
      const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

      // Get today's day for filtering classes
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = days[new Date().getDay()];
      const todayClassesList = (classesData.classes || []).filter(c => c.day === today);

      setStats({
        totalMembers: membersData.totalMembers || 0,
        activeMembers: membersData.activeMembers || 0,
        totalTrainers: trainersData.trainers?.length || 0,
        totalRevenue,
        pendingPayments: pendingPayments.length,
        pendingAmount,
        todayAttendance: attendanceData.count || 0
      });

      // Fetch recent members
      const recentMembersRes = await fetch('/api/members?limit=5', { headers });
      const recentMembersData = await recentMembersRes.json();
      setRecentMembers(recentMembersData.members || []);
      
      setTodayClasses(todayClassesList);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your gym today.</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchDashboardData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-header">
            <div className="stat-icon">👥</div>
            <span className="stat-label">Total Members</span>
          </div>
          <div className="stat-body">
            <h2 className="stat-number">{stats.totalMembers}</h2>
            <p className="stat-change">All registered members</p>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-header">
            <div className="stat-icon">✅</div>
            <span className="stat-label">Active Members</span>
          </div>
          <div className="stat-body">
            <h2 className="stat-number">{stats.activeMembers}</h2>
            <p className="stat-change">Currently active</p>
          </div>
        </div>

        <div className="stat-card pink">
          <div className="stat-header">
            <div className="stat-icon">👨‍🏫</div>
            <span className="stat-label">Total Trainers</span>
          </div>
          <div className="stat-body">
            <h2 className="stat-number">{stats.totalTrainers}</h2>
            <p className="stat-change">Professional trainers</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-header">
            <div className="stat-icon">💰</div>
            <span className="stat-label">Total Revenue</span>
          </div>
          <div className="stat-body">
            <h2 className="stat-number">₹{stats.totalRevenue.toLocaleString()}</h2>
            <p className="stat-change">Completed payments</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-header">
            <div className="stat-icon">⏳</div>
            <span className="stat-label">Pending Payments</span>
          </div>
          <div className="stat-body">
            <h2 className="stat-number">{stats.pendingPayments}</h2>
            <p className="stat-change">₹{stats.pendingAmount.toLocaleString()} outstanding</p>
          </div>
        </div>

        <div className="stat-card teal">
          <div className="stat-header">
            <div className="stat-icon">📊</div>
            <span className="stat-label">Today's Attendance</span>
          </div>
          <div className="stat-body">
            <h2 className="stat-number">{stats.todayAttendance}</h2>
            <p className="stat-change">Members checked in</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Members */}
        <div className="dashboard-card recent-members">
          <div className="card-header">
            <h3>Recent Members</h3>
            <a href="#" onClick={() => window.location.hash = 'members'} className="view-all">View All →</a>
          </div>
          <div className="members-list">
            {recentMembers.length > 0 ? (
              recentMembers.map((member) => (
                <div key={member._id} className="member-item">
                  <div className="member-avatar">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p>{member.email}</p>
                  </div>
                  <span className={`status-badge ${member.status}`}>
                    {member.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">No recent members</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="actions-grid">
            <a href="#" onClick={() => window.location.hash = 'members'} className="action-card">
              <div className="action-icon">➕</div>
              <span>Add Member</span>
            </a>
            <a href="#" onClick={() => window.location.hash = 'trainers'} className="action-card">
              <div className="action-icon">👨‍🏫</div>
              <span>Manage Trainers</span>
            </a>
            <a href="#" onClick={() => window.location.hash = 'plans'} className="action-card">
              <div className="action-icon">📋</div>
              <span>Manage Plans</span>
            </a>
            <a href="#" onClick={() => window.location.hash = 'classes'} className="action-card">
              <div className="action-icon">🎯</div>
              <span>Schedule Class</span>
            </a>
            <a href="#" onClick={() => window.location.hash = 'payments'} className="action-card">
              <div className="action-icon">💳</div>
              <span>View Payments</span>
            </a>
            <a href="#" onClick={() => window.location.hash = 'announcements'} className="action-card">
              <div className="action-icon">📢</div>
              <span>Announcements</span>
            </a>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="dashboard-card revenue-chart">
          <div className="card-header">
            <h3>Revenue Overview</h3>
          </div>
          <div className="chart-placeholder">
            <div className="revenue-summary">
              <div className="revenue-item">
                <span className="revenue-label">Total Revenue</span>
                <span className="revenue-value">₹{stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="revenue-item">
                <span className="revenue-label">Pending Amount</span>
                <span className="revenue-value pending">₹{stats.pendingAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Classes */}
        <div className="dashboard-card upcoming-classes">
          <div className="card-header">
            <h3>Today's Classes</h3>
            <a href="#" onClick={() => window.location.hash = 'classes'} className="view-all">View Schedule →</a>
          </div>
          <div className="classes-list">
            {todayClasses.length > 0 ? (
              todayClasses.map((classItem) => (
                <div key={classItem._id} className="class-item">
                  <div className="class-time">{classItem.time}</div>
                  <div className="class-details">
                    <h4>{classItem.name}</h4>
                    <p>Instructor: {classItem.instructor}</p>
                  </div>
                  <span className="class-capacity">{classItem.enrolled || 0}/{classItem.capacity}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No classes scheduled for today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
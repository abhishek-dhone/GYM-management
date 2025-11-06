import React, { useEffect, useState, useCallback } from 'react';
import './UserDashboard.css';

function UserDashboard({ user }) {
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  // Removed unused myClasses and setMyClasses
  const [myStats, setMyStats] = useState({
    classesThisMonth: 0,
    totalHours: 0,
    daysActive: 0
  });
  const [payments, setPayments] = useState([]);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  // Removed unused selectedPlan
  const [plans, setPlans] = useState([]);

  const fetchAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch member data
      const memberRes = await fetch('/api/members', { headers });
      const memberData = await memberRes.json();
      const currentMember = memberData.members?.find(m => m.email === user.email);
      setMemberData(currentMember);

      // Fetch classes
      const classesRes = await fetch('/api/classes', { headers });
      const classesData = await classesRes.json();
      
      // Get today's day
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = days[new Date().getDay()];
      const todayClasses = (classesData.classes || []).filter(c => c.day === today);
      setUpcomingClasses(todayClasses);

      // Fetch attendance to calculate stats
      const attendanceRes = await fetch('/api/attendance', { headers });
      const attendanceData = await attendanceRes.json();
      
      // Calculate user stats from attendance
      const userAttendance = (attendanceData.attendance || []).filter(
        a => a.memberId === currentMember?._id
      );
      
      const thisMonth = new Date().getMonth();
      const thisMonthAttendance = userAttendance.filter(a => 
        new Date(a.date).getMonth() === thisMonth
      );
      
      const totalHours = userAttendance.reduce((sum, a) => sum + (a.duration || 60), 0) / 60;
      
      setMyStats({
        classesThisMonth: thisMonthAttendance.length,
        totalHours: Math.round(totalHours),
        daysActive: userAttendance.length
      });

      // Fetch payments
      const paymentsRes = await fetch('/api/payments', { headers });
      const paymentsData = await paymentsRes.json();
      const userPayments = (paymentsData.payments || []).filter(
        p => p.memberId === currentMember?._id || p.email === user.email
      );
      setPayments(userPayments);

      // Fetch plans for renewal
      const plansRes = await fetch('/api/plans', { headers });
      const plansData = await plansRes.json();
      setPlans(plansData.plans || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleRenewMembership = () => {
    setShowRenewModal(true);
  };

  const handleSelectPlan = async (plan) => {
    // Create payment record
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          memberId: memberData._id,
          memberName: user.name,
          email: user.email,
          plan: plan.name,
          amount: plan.price,
          method: 'Pending',
          status: 'pending'
        })
      });

      if (response.ok) {
        alert(`Payment initiated for ${plan.name} plan (₹${plan.price}). Please complete payment.`);
        setShowRenewModal(false);
        fetchAllData(); // Refresh data
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Failed to initiate payment');
    }
  };

  const handleBookClass = (classItem) => {
    // Check if already enrolled
    if (classItem.enrolled >= classItem.capacity) {
      alert('Sorry, this class is full!');
      return;
    }

    // Mark attendance
    const markAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            memberId: memberData._id,
            memberName: user.name,
            date: new Date(),
            checkIn: new Date()
          })
        });

        alert(`Successfully booked ${classItem.name}!`);
        fetchAllData(); // Refresh to show updated stats
      } catch (error) {
        console.error('Error booking class:', error);
        alert('Failed to book class');
      }
    };

    markAttendance();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 💪</h1>
        <p>Keep pushing towards your fitness goals</p>
      </div>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="dashboard-card profile-card">
          <h3>👤 Your Profile</h3>
          <div className="profile-info">
            <div className="profile-avatar">{user.name.charAt(0)}</div>
            <div className="profile-details">
              <p><strong>Name:</strong> {memberData?.name || user.name}</p>
              <p><strong>Email:</strong> {memberData?.email || user.email}</p>
              <p><strong>Phone:</strong> {memberData?.phone || 'Not set'}</p>
              <p><strong>Membership:</strong> 
                <span className={`membership-badge ${memberData?.membershipType}`}>
                  {memberData?.membershipType || 'Basic'}
                </span>
              </p>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${memberData?.status}`}>
                  {memberData?.status || 'Active'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Membership Card */}
        <div className="dashboard-card membership-card">
          <h3>📅 Membership Details</h3>
          <div className="membership-info">
            <div className="info-item">
              <span className="info-label">Joined Date</span>
              <span className="info-value">
                {memberData?.createdAt ? new Date(memberData.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Current Plan</span>
              <span className="info-value">
                {memberData?.membershipType || 'Basic'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value">
                {memberData?.status || 'Active'}
              </span>
            </div>
          </div>
          <button className="btn-renew" onClick={handleRenewMembership}>
            🔄 Renew/Upgrade Membership
          </button>
        </div>

        {/* Live Stats */}
        <div className="dashboard-card stats-card">
          <h3>📊 Your Stats</h3>
          <div className="quick-stats">
            <div className="stat-box">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <div className="stat-number">{myStats.classesThisMonth}</div>
                <div className="stat-text">Classes This Month</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⏱️</div>
              <div className="stat-info">
                <div className="stat-number">{myStats.totalHours}</div>
                <div className="stat-text">Total Hours</div>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <div className="stat-number">{myStats.daysActive}</div>
                <div className="stat-text">Days Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Upcoming Classes */}
        <div className="dashboard-card classes-card">
          <h3>🎯 Today's Classes</h3>
          <div className="classes-list">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((classItem) => (
                <div key={classItem._id} className="class-item">
                  <div className="class-time">{classItem.time}</div>
                  <div className="class-details">
                    <div className="class-name">{classItem.name}</div>
                    <div className="class-trainer">with {classItem.instructor}</div>
                  </div>
                  <button 
                    className="btn-book"
                    onClick={() => handleBookClass(classItem)}
                    disabled={classItem.enrolled >= classItem.capacity}
                  >
                    {classItem.enrolled >= classItem.capacity ? 'Full' : 'Book'}
                  </button>
                </div>
              ))
            ) : (
              <p className="no-data">No classes scheduled for today</p>
            )}
          </div>
          <button className="btn-view-all" onClick={() => setShowClassModal(true)}>
            View All Classes →
          </button>
        </div>

        {/* Quick Actions - Now Functional */}
        <div className="dashboard-card actions-card">
          <h3>⚡ Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => setShowClassModal(true)}>
              <span className="action-icon">📅</span>
              <span>Book a Class</span>
            </button>
            <button className="action-btn" onClick={() => alert('Trainer booking coming soon!')}>
              <span className="action-icon">👨‍🏫</span>
              <span>Find a Trainer</span>
            </button>
            <button className="action-btn" onClick={() => alert(`You've attended ${myStats.classesThisMonth} classes this month!`)}>
              <span className="action-icon">📊</span>
              <span>View Progress</span>
            </button>
            <button className="action-btn" onClick={() => {
              const paymentSummary = payments.length > 0 
                ? `Total Payments: ${payments.length}\nLast Payment: ₹${payments[0]?.amount || 0}`
                : 'No payment history';
              alert(paymentSummary);
            }}>
              <span className="action-icon">💳</span>
              <span>Payment History</span>
            </button>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="dashboard-card progress-card">
          <h3>📈 Your Progress</h3>
          <div className="progress-content">
            <div className="progress-stat">
              <span className="progress-label">Monthly Goal</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min((myStats.classesThisMonth / 12) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="progress-text">{myStats.classesThisMonth}/12 classes</span>
            </div>
            <div className="progress-stat">
              <span className="progress-label">Total Hours Trained</span>
              <div className="progress-number">{myStats.totalHours} hrs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Renew Membership Modal */}
      {showRenewModal && (
        <div className="modal-overlay" onClick={() => setShowRenewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Choose Your Plan</h2>
              <button className="btn-close" onClick={() => setShowRenewModal(false)}>✕</button>
            </div>
            <div className="plans-grid">
              {plans.map((plan) => (
                <div key={plan._id} className="plan-option">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">₹{plan.price}</div>
                  <p className="plan-duration">{plan.duration}</p>
                  <ul className="plan-features">
                    {plan.features?.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                  <button 
                    className="btn-select-plan"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Classes Modal */}
      {showClassModal && (
        <div className="modal-overlay" onClick={() => setShowClassModal(false)}>
          <div className="modal-content classes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>All Available Classes</h2>
              <button className="btn-close" onClick={() => setShowClassModal(false)}>✕</button>
            </div>
            <div className="all-classes-list">
              {upcomingClasses.map((classItem) => (
                <div key={classItem._id} className="class-card-modal">
                  <h4>{classItem.name}</h4>
                  <p>👨‍🏫 {classItem.instructor}</p>
                  <p>📅 {classItem.day} at {classItem.time}</p>
                  <p>⏱️ {classItem.duration} minutes</p>
                  <p>👥 {classItem.enrolled}/{classItem.capacity} enrolled</p>
                  <button 
                    className="btn-book-modal"
                    onClick={() => {
                      handleBookClass(classItem);
                      setShowClassModal(false);
                    }}
                    disabled={classItem.enrolled >= classItem.capacity}
                  >
                    {classItem.enrolled >= classItem.capacity ? 'Class Full' : 'Book Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
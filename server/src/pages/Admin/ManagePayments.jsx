// pages/Admin/ManagePayments.jsx
import React, { useEffect, useState } from 'react';
import './ManagePayments.css';

function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedPayment = await response.json();
        setPayments(payments.map(p => p._id === id ? updatedPayment : p));
        alert('Payment status updated!');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = payment.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedAmount = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) {
    return (
      <div className="payments-loading">
        <div className="spinner"></div>
        <p>Loading Payments...</p>
      </div>
    );
  }

  return (
    <div className="manage-payments">
      <div className="payments-header">
        <div>
          <h1>Payment Management</h1>
          <p>Track and manage member payments</p>
        </div>
        <button className="btn-export">📥 Export Report</button>
      </div>

      {/* Stats */}
      <div className="payment-stats">
        <div className="stat-card total">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">₹{completedAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value">₹{pendingAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="payments-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by member name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'failed' ? 'active' : ''}`}
            onClick={() => setFilter('failed')}
          >
            Failed
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>
                    <div className="member-cell">
                      <div className="member-avatar">
                        {payment.memberName?.charAt(0).toUpperCase() || 'M'}
                      </div>
                      <span>{payment.memberName || 'N/A'}</span>
                    </div>
                  </td>
                  <td>{payment.email || 'N/A'}</td>
                  <td><span className="plan-badge">{payment.plan || 'Basic'}</span></td>
                  <td className="amount">₹{payment.amount?.toLocaleString() || 0}</td>
                  <td>{payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}</td>
                  <td>{payment.method || 'Card'}</td>
                  <td>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={payment.status}
                      onChange={(e) => handleStatusUpdate(payment._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagePayments;
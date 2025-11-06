// pages/Admin/ManagePlans.jsx
import React, { useEffect, useState } from 'react';
import './ManagePlans.css';

function ManagePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    features: '',
    description: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/plans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingPlan 
        ? `/api/plans/${editingPlan._id}` 
        : '/api/plans';
      
      const method = editingPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.split(',').map(f => f.trim())
        })
      });

      if (response.ok) {
        const newPlan = await response.json();
        
        if (editingPlan) {
          // Update existing plan
          setPlans(plans.map(p => p._id === newPlan._id ? newPlan : p));
        } else {
          // Add new plan
          setPlans([newPlan, ...plans]);
        }
        
        handleCloseModal();
        alert(editingPlan ? 'Plan updated successfully!' : 'Plan added successfully!');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: Array.isArray(plan.features) ? plan.features.join(', ') : '',
      description: plan.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setPlans(plans.filter(p => p._id !== id));
        alert('Plan deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      name: '',
      price: '',
      duration: '',
      features: '',
      description: ''
    });
  };

  if (loading) {
    return (
      <div className="plans-loading">
        <div className="spinner"></div>
        <p>Loading Plans...</p>
      </div>
    );
  }

  return (
    <div className="manage-plans">
      {/* Header */}
      <div className="plans-header">
        <div>
          <h1>Membership Plans</h1>
          <p>Manage your gym membership plans and pricing</p>
        </div>
        <button className="btn-add-plan" onClick={() => setShowModal(true)}>
          ➕ Add New Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="plans-grid">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div key={plan._id} className="plan-card">
              <div className="plan-badge">{plan.name}</div>
              <div className="plan-price">
                <span className="currency">₹</span>
                <span className="amount">{plan.price}</span>
                <span className="period">/{plan.duration}</span>
              </div>
              <div className="plan-description">
                {plan.description || 'No description available'}
              </div>
              <div className="plan-features">
                <h4>Features:</h4>
                <ul>
                  {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
              <div className="plan-actions">
                <button className="btn-edit" onClick={() => handleEdit(plan)}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(plan._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-plans">
            <p>No membership plans found</p>
            <button className="btn-add-plan" onClick={() => setShowModal(true)}>
              ➕ Add Your First Plan
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="plan-form">
              <div className="form-group">
                <label>Plan Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Basic, Premium, VIP"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 999"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duration *</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Duration</option>
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the plan"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Features (comma separated) *</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="e.g., Access to gym, Personal trainer, Diet plan"
                  rows="4"
                  required
                />
                <small>Separate each feature with a comma</small>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingPlan ? 'Update Plan' : 'Add Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagePlans;
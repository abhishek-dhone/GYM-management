import React, { useState } from 'react';
import './AddMemberForm.css';

function AddMemberForm({ onMemberAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: 'Basic',
    address: '',
    emergencyContact: {
      name: '',
      phone: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [field]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to add members');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      onMemberAdded(data);
      setFormData({
        name: '',
        email: '',
        phone: '',
        membershipType: 'Basic',
        address: '',
        emergencyContact: { name: '', phone: '' }
      });
      alert('✅ Member added successfully!');

    } catch (err) {
      console.error('Error adding member:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-member-form">
      <h3>Add New Member</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Membership Type *</label>
            <select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="Basic">Basic - ₹1,000/month</option>
              <option value="Premium">Premium - ₹2,000/month</option>
              <option value="VIP">VIP - ₹5,000/month</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            rows="2"
            disabled={loading}
          />
        </div>

        <h4>Emergency Contact</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Contact Name</label>
            <input
              name="emergency.name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              placeholder="Emergency Contact Name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Contact Phone</label>
            <input
              name="emergency.phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              placeholder="Emergency Phone"
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </form>
    </div>
  );
}

export default AddMemberForm;
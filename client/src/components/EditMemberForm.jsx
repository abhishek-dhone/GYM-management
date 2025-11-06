import React, { useState } from 'react';
import './EditMemberForm.css';

function EditMemberForm({ member, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    name: member.name || '',
    email: member.email || '',
    phone: member.phone || '',
    membershipType: member.membershipType || 'Basic',
    status: member.status || 'Active',
    address: member.address || '',
    emergencyContact: {
      name: member.emergencyContact?.name || '',
      phone: member.emergencyContact?.phone || ''
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

      const response = await fetch(`/api/members/${member._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update member');
      }

      onUpdateSuccess(data);
      alert('✅ Member updated successfully!');

    } catch (err) {
      console.error('Error updating member:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✏️ Edit Member</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">❌</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h4>📋 Basic Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="email@example.com"
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
                  disabled={loading}
                  placeholder="1234567890"
                />
              </div>

              <div className="form-group">
                <label>Membership Type</label>
                <select
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Basic">💼 Basic</option>
                  <option value="Premium">⭐ Premium</option>
                  <option value="VIP">👑 VIP</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Active">✅ Active</option>
                <option value="Inactive">⏸️ Inactive</option>
                <option value="Suspended">🚫 Suspended</option>
              </select>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                disabled={loading}
                placeholder="Enter full address"
              />
            </div>
          </div>

          <div className="form-section">
            <h4>🚨 Emergency Contact</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Name</label>
                <input
                  name="emergency.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Emergency contact name"
                />
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  name="emergency.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Emergency phone"
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Updating...
                </>
              ) : (
                '✅ Update Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMemberForm;
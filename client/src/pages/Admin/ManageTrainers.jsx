import React, { useState, useEffect } from 'react';
import './ManageTrainers.css';

function ManageTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: [],
    experience: 0,
    hourlyRate: 500
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trainers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchTrainers();
        setShowForm(false);
        setFormData({ name: '', email: '', phone: '', specialization: [], experience: 0, hourlyRate: 500 });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trainer?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/trainers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchTrainers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="manage-trainers">
      <div className="page-header">
        <h1>👨‍🏫 Manage Trainers</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-add">
          ➕ Add Trainer
        </button>
      </div>

      {showForm && (
        <div className="trainer-form-card">
          <h3>Add New Trainer</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Trainer Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Experience (years)"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            <input
              type="number"
              placeholder="Hourly Rate (₹)"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
            />
            <div className="form-actions">
              <button type="submit" className="btn-submit">Add Trainer</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="trainers-grid">
        {trainers.map(trainer => (
          <div key={trainer._id} className="trainer-card">
            <div className="trainer-avatar">{trainer.name.charAt(0)}</div>
            <h3>{trainer.name}</h3>
            <p className="trainer-email">{trainer.email}</p>
            <p className="trainer-phone">📞 {trainer.phone}</p>
            <p className="trainer-experience">⭐ {trainer.experience} years experience</p>
            <p className="trainer-rate">💰 ₹{trainer.hourlyRate}/hour</p>
            <div className="trainer-actions">
              <button onClick={() => handleDelete(trainer._id)} className="btn-delete">
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageTrainers;
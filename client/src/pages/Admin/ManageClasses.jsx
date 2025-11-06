// pages/Admin/ManageClasses.jsx - FIXED (No duplicate buttons)
import React, { useEffect, useState } from 'react';
import './ManageClasses.css';

function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    day: '',
    time: '',
    duration: '',
    capacity: '',
    description: ''
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
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
      const url = editingClass 
        ? `/api/classes/${editingClass._id}` 
        : '/api/classes';
      
      const method = editingClass ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedClass = await response.json();
        
        if (editingClass) {
          // Update existing class in state
          setClasses(classes.map(c => c._id === savedClass._id ? savedClass : c));
        } else {
          // Add new class to state
          setClasses([savedClass, ...classes]);
        }
        
        handleCloseModal();
        alert(editingClass ? 'Class updated successfully!' : 'Class added successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save class');
      }
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Failed to save class. Please try again.');
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      instructor: classItem.instructor,
      day: classItem.day,
      time: classItem.time,
      duration: classItem.duration,
      capacity: classItem.capacity,
      description: classItem.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setClasses(classes.filter(c => c._id !== id));
        alert('Class deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Failed to delete class');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({
      name: '',
      instructor: '',
      day: '',
      time: '',
      duration: '',
      capacity: '',
      description: ''
    });
  };

  if (loading) {
    return (
      <div className="classes-loading">
        <div className="spinner"></div>
        <p>Loading Classes...</p>
      </div>
    );
  }

  return (
    <div className="manage-classes">
      <div className="classes-header">
        <div>
          <h1>Class Schedule</h1>
          <p>Manage gym classes and schedules</p>
        </div>
        <button className="btn-add-class" onClick={() => setShowModal(true)}>
          ➕ Add New Class
        </button>
      </div>

      <div className="classes-grid">
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <div key={classItem._id} className="class-card">
              <div className="class-day">{classItem.day}</div>
              <h3 className="class-name">{classItem.name}</h3>
              <div className="class-info">
                <div className="info-item">
                  <span className="icon">👨‍🏫</span>
                  <span>{classItem.instructor}</span>
                </div>
                <div className="info-item">
                  <span className="icon">🕐</span>
                  <span>{classItem.time}</span>
                </div>
                <div className="info-item">
                  <span className="icon">⏱️</span>
                  <span>{classItem.duration} mins</span>
                </div>
                <div className="info-item">
                  <span className="icon">👥</span>
                  <span>{classItem.enrolled || 0}/{classItem.capacity}</span>
                </div>
              </div>
              {classItem.description && (
                <p className="class-description">{classItem.description}</p>
              )}
              <div className="class-actions">
                <button className="btn-edit" onClick={() => handleEdit(classItem)}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(classItem._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-classes">
            <div className="empty-icon">📅</div>
            <p>No classes scheduled yet</p>
            <button className="btn-add-class" onClick={() => setShowModal(true)}>
              ➕ Schedule Your First Class
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="class-form">
              <div className="form-group">
                <label>Class Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Yoga, Cardio, Strength Training"
                  required
                />
              </div>

              <div className="form-group">
                <label>Instructor *</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="Instructor name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Day *</label>
                  <select name="day" value={formData.day} onChange={handleInputChange} required>
                    <option value="">Select Day</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (mins) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="60"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="20"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the class"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingClass ? 'Update Class' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageClasses;
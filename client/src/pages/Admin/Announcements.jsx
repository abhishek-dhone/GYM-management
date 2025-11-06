// pages/Admin/Announcements.jsx
import React, { useEffect, useState } from 'react';
import './Announcements.css';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'normal',
    category: 'general'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/announcements', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
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
      const url = editingAnnouncement 
        ? `/api/announcements/${editingAnnouncement._id}` 
        : '/api/announcements';
      
      const method = editingAnnouncement ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedAnnouncement = await response.json();
        
        if (editingAnnouncement) {
          setAnnouncements(announcements.map(a => 
            a._id === savedAnnouncement._id ? savedAnnouncement : a
          ));
        } else {
          setAnnouncements([savedAnnouncement, ...announcements]);
        }
        
        handleCloseModal();
        alert(editingAnnouncement ? 'Announcement updated!' : 'Announcement posted!');
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      priority: announcement.priority || 'normal',
      category: announcement.category || 'general'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setAnnouncements(announcements.filter(a => a._id !== id));
      alert('Announcement deleted!');
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      message: '',
      priority: 'normal',
      category: 'general'
    });
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'urgent': return '🚨';
      case 'important': return '⚠️';
      default: return '📢';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'maintenance': return '🔧';
      case 'event': return '🎉';
      case 'schedule': return '📅';
      case 'policy': return '📋';
      default: return '📢';
    }
  };

  if (loading) {
    return (
      <div className="announcements-loading">
        <div className="spinner"></div>
        <p>Loading Announcements...</p>
      </div>
    );
  }

  return (
    <div className="announcements-page">
      <div className="announcements-header">
        <div>
          <h1>Announcements</h1>
          <p>Broadcast important messages to all members</p>
        </div>
        <button className="btn-new-announcement" onClick={() => setShowModal(true)}>
          ➕ New Announcement
        </button>
      </div>

      <div className="announcements-list">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement._id} className={`announcement-card ${announcement.priority}`}>
              <div className="announcement-header">
                <div className="announcement-meta">
                  <span className="priority-badge">
                    {getPriorityIcon(announcement.priority)}
                    {announcement.priority}
                  </span>
                  <span className="category-badge">
                    {getCategoryIcon(announcement.category)}
                    {announcement.category}
                  </span>
                </div>
                <span className="announcement-date">
                  {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
              <h3 className="announcement-title">{announcement.title}</h3>
              <p className="announcement-message">{announcement.message}</p>
              <div className="announcement-actions">
                <button className="btn-edit" onClick={() => handleEdit(announcement)}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(announcement._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-announcements">
            <div className="empty-icon">📢</div>
            <p>No announcements yet</p>
            <button className="btn-new-announcement" onClick={() => setShowModal(true)}>
              ➕ Create First Announcement
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="announcement-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Announcement title"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority *</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} required>
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="general">General</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="event">Event</option>
                    <option value="schedule">Schedule</option>
                    <option value="policy">Policy</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your announcement message here..."
                  rows="6"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingAnnouncement ? 'Update' : 'Post'} Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;
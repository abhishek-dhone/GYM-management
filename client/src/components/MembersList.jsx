import React, { useEffect, useState } from 'react';
import EditMemberForm from './EditMemberForm';
import './MembersList.css';

function MembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view members');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/members', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend not responding');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch members');
      }

      setMembers(data.members || data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setMembers(members.filter(m => m._id !== id));
      alert('✅ Member deleted successfully!');
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
  };

  const handleUpdateSuccess = (updatedMember) => {
    setMembers(members.map(m => m._id === updatedMember._id ? updatedMember : m));
    setEditingMember(null);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.phone && member.phone.includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Members</h3>
        <p>{error}</p>
        <button onClick={fetchMembers} className="retry-btn">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="members-list-container">
      <div className="members-list-header">
        <div className="header-left">
          <h1>👥 Members ({members.length})</h1>
          <p>Manage all your gym members</p>
        </div>
        <div className="header-right">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>
      
      {editingMember && (
        <EditMemberForm
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {filteredMembers.length === 0 ? (
        <div className="no-members">
          <div className="no-members-icon">📋</div>
          <h3>No members found</h3>
          <p>Add your first member to get started!</p>
        </div>
      ) : (
        <div className="members-table-wrapper">
          <table className="members-table-modern">
            <thead>
              <tr>
                <th>Member</th>
                <th>Contact</th>
                <th>Membership</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id}>
                  <td>
                    <div className="member-info">
                      <div className="member-avatar-small">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="member-details">
                        <div className="member-name-text">{member.name}</div>
                        <div className="member-id">ID: {member._id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-email">📧 {member.email}</div>
                      <div className="contact-phone">📞 {member.phone || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`membership-pill ${member.membershipType}`}>
                      {member.membershipType === 'Basic' && '💼'}
                      {member.membershipType === 'Premium' && '⭐'}
                      {member.membershipType === 'VIP' && '👑'}
                      {member.membershipType}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${member.status}`}>
                      {member.status === 'Active' && '✅'}
                      {member.status === 'Inactive' && '⏸️'}
                      {member.status === 'Suspended' && '🚫'}
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      {new Date(member.joinedDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <button 
                        onClick={() => handleEdit(member)} 
                        className="btn-action btn-edit-action"
                        title="Edit Member"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(member._id)} 
                        className="btn-action btn-delete-action"
                        title="Delete Member"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MembersList;
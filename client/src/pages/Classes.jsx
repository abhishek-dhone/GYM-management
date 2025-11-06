// ========== pages/Classes.jsx ==========
import { useState, useEffect } from 'react';

function Classes() {
  const [classes, setClasses] = useState([]);

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
      setClasses(data);
    } catch (error) {
      // Default classes
      setClasses([
        { _id: '1', name: 'Yoga', schedule: { day: 'Monday', startTime: '7:00 AM', endTime: '8:00 AM' }, trainer: { name: 'Sarah' }, capacity: 20, enrolled: 15, category: 'Yoga' },
        { _id: '2', name: 'CrossFit', schedule: { day: 'Tuesday', startTime: '6:00 PM', endTime: '7:00 PM' }, trainer: { name: 'John' }, capacity: 15, enrolled: 12, category: 'CrossFit' },
        { _id: '3', name: 'Zumba', schedule: { day: 'Wednesday', startTime: '5:00 PM', endTime: '6:00 PM' }, trainer: { name: 'Mike' }, capacity: 25, enrolled: 20, category: 'Zumba' }
      ]);
    }
  };

  return (
    <div className="classes-page">
      <section className="classes-hero">
        <h1>🎯 Our Classes</h1>
        <p>Find the perfect class for your fitness journey</p>
      </section>

      <section className="classes-grid">
        {classes.map(cls => (
          <div key={cls._id} className="class-card">
            <div className="class-category-badge">{cls.category}</div>
            <h3>{cls.name}</h3>
            <p className="class-trainer">👨‍🏫 Trainer: {cls.trainer?.name || 'TBA'}</p>
            <p className="class-schedule">📅 {cls.schedule.day} | ⏰ {cls.schedule.startTime} - {cls.schedule.endTime}</p>
            <div className="class-capacity">
              <div className="capacity-bar">
                <div 
                  className="capacity-fill" 
                  style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                />
              </div>
              <p>{cls.enrolled}/{cls.capacity} enrolled</p>
            </div>
            <button className="btn-book">Book Class</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export { Contact, About, Classes };